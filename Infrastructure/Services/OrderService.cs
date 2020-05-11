using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications.Orders;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IRepositoryUnitOfWork _repoUnitOfWork;

        public OrderService(IBasketRepository basketRepo, IRepositoryUnitOfWork repoUnitOfWork)
        {
            _basketRepo = basketRepo;
            _repoUnitOfWork = repoUnitOfWork;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, IAddress shippingAddress)
        {
            // Get basket from repo
            var basket = await _basketRepo.GetBasketAsync(basketId);

            // Get the items from the product repo
            var orderItems = new List<OrderItem>();

            foreach (var basketItem in basket.Items)
            {
                var product = await _repoUnitOfWork.Repository<Product>().GetByIdAsync(basketItem.Id);

                if (product != null)
                {
                    var productItemOrdered = new ProductItemOrdered(product);
                    var orderItem = new OrderItem(productItemOrdered, product.Price, basketItem.Quantity);
                    orderItems.Add(orderItem);
                }
            }

            // Get the delivery method
            var deliveryMethod = await _repoUnitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);

            // Calc subtotal
            var subTotal = orderItems.Sum(x => x.Price * x.Quantity);

            // Create order
            var order = new Order
            (
                orderItems,
                buyerEmail,
                shippingAddress,
                deliveryMethod,
                subTotal
            );

            // Save to db
            _repoUnitOfWork.Repository<Order>().Add(order);

            var result = await _repoUnitOfWork.SaveChanges();

            if (result <= 0) return null;

            // Delete basket
            await _basketRepo.DeleteBasketAsync(basketId);

            return order;
        }

        public async Task<DeliveryMethod[]> GetDeliveryMethodsAsync()
        {
            return await _repoUnitOfWork.Repository<DeliveryMethod>().GetAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
             var spec = new OrdersForBuyerSpec(id, buyerEmail);

            return await _repoUnitOfWork.Repository<Order>().GetEntityAsync(spec);
        }

        public async Task<Order[]> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersForBuyerSpec(buyerEmail);

            return await _repoUnitOfWork.Repository<Order>().GetEntitiesAsync(spec);
        }
    }
}