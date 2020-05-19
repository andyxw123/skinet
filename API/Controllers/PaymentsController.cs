using System.IO;
using System.Threading.Tasks;
using API.Errors;
using Core.Entities.Cache;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Stripe;

namespace API.Controllers
{

    public class PaymentsController : BaseApiController
    {
        private readonly IPaymentService _paymentService;
        private readonly string _webhookSecret;
        private readonly IConfiguration _config;
        private readonly ILogger<IPaymentService> _logger;
        public PaymentsController(IPaymentService paymentService, IConfiguration config, ILogger<IPaymentService> logger)
        {
            _paymentService = paymentService;
            _config = config;
            _logger = logger;

            _webhookSecret = config["StripeSettings:WebhookSecret"];
        }

        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
        {
            var basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);

            if (basket == null)
            {
                return ApiResponse.BadRequest();
            }

            return basket;
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeSignature = Request.Headers["Stripe-Signature"];

            var stripeEvent = EventUtility.ConstructEvent(json, stripeSignature, _webhookSecret);

            PaymentIntent intent;
            Core.Entities.OrderAggregate.Order order;

            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment Succeeded: ", intent.Id);
                    order = await _paymentService.UpdateOrderPaymentSucceeded(intent.Id);
                    _logger.LogInformation("OrderStatus updated to PaymentReceived: ", intent.Id);
                    break;
                case "payment_intent.payment_failed":
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment Failed: ", intent.Id);
                    order = await _paymentService.UpdateOrderPaymentFailed(intent.Id);
                    _logger.LogInformation("OrderStatus updated to PaymentFailed: ", intent.Id);
                    break;
            }

            // Lets Stripe know we've received the event. If they don't receive this they will
            // resend over a couple of days
            return new EmptyResult();
        }

    }
}