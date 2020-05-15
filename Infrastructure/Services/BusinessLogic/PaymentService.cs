using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Cache;
using Core.Entities.OrderAggregate;
using Core.Entities.OrderAggregate.Enums;
using Core.Interfaces;
using Core.Specifications.Orders;
using Microsoft.Extensions.Configuration;
using Stripe;
using Order = Core.Entities.OrderAggregate.Order;
using Product = Core.Entities.Product;

namespace Infrastructure.Services.BusinessLogic
{
    public class PaymentService : IPaymentService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IRepositoryUnitOfWork _storeRepo;
        private readonly IConfiguration _config;
        public PaymentService(IBasketRepository basketRepository, IRepositoryUnitOfWork storeRepo, IConfiguration config)
        {
            _config = config;
            _storeRepo = storeRepo;
            _basketRepository = basketRepository;
        }

        public async Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId)
        {
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

            var basket = await _basketRepository.GetBasketAsync(basketId);

            if (basket == null) {
                return null;
            }

            var shippingPrice = 0m;

            if (basket.DeliveryMethodId.HasValue)
            {
                var deliveryMethod = await _storeRepo.Repository<DeliveryMethod>().GetByIdAsync(basket.DeliveryMethodId.Value);

                shippingPrice = deliveryMethod.Price;
            }

            foreach (var item in basket.Items)
            {
                var productItem = await _storeRepo.Repository<Product>().GetByIdAsync(item.Id);

                if (item.Price != productItem.Price)
                {
                    item.Price = productItem.Price;
                }
            }

            var paymentIntentService = new PaymentIntentService();

            long amountAsLong = (long) basket.Items.Sum(x => (x.Price * 100) * x.Quantity) + (long)(shippingPrice * 100);

            if (string.IsNullOrWhiteSpace(basket.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = amountAsLong,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string>{"card"}
                };

                PaymentIntent intent = await paymentIntentService.CreateAsync(options);
                basket.PaymentIntentId = intent.Id;
                basket.ClientSecret = intent.ClientSecret;
            }
            else 
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = amountAsLong
                };

                 await paymentIntentService.UpdateAsync(basket.PaymentIntentId, options);
            }

            await _basketRepository.UpdateBasketAsync(basket);

            return basket;
        }

        public async Task<Order> UpdateOrderPaymentFailed(string paymentIntentId)
        {
            return await UpdateOrderPaymentStatus(paymentIntentId, OrderStatus.PaymentFailed);
        }

        public async Task<Order> UpdateOrderPaymentSucceeded(string paymentIntentId)
        {
            return await UpdateOrderPaymentStatus(paymentIntentId, OrderStatus.PaymentReceived);
        }

        private async Task<Order> UpdateOrderPaymentStatus(string paymentIntentId, OrderStatus  orderStatus)
        {
            var spec = new OrderForPaymentIntentIdSpec(paymentIntentId);

            var order = await _storeRepo.Repository<Order>().GetEntityAsync(spec);

            if (order == null)
            {
                return null;
            }

            order.Status = orderStatus;

            _storeRepo.Repository<Order>().Update(order);

            await _storeRepo.SaveChanges();

            return order;
        }
    }
}