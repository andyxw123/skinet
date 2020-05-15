using System;
using System.Linq.Expressions;
using Core.Entities.OrderAggregate;

namespace Core.Specifications.Orders
{
    public class OrderForPaymentIntentIdSpec : BaseSpecification<Order>
    {
        public OrderForPaymentIntentIdSpec(string paymentIntentId) 
            : base(o => o.PaymentIntentId == paymentIntentId)
        {
        }
    }
}