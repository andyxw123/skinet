using System;
using System.Collections.Generic;
using Core.Entities.OrderAggregate.Enums;
using Core.Interfaces;

namespace Core.Entities.OrderAggregate
{
    public class Order : BaseEntity
    {
        public Order()
        {
        }

        public Order(IReadOnlyList<OrderItem> orderItems, string buyerEmail, IAddress shipToAddress, DeliveryMethod deliveryMethod, decimal subTotal)
        {
            OrderItems = orderItems;
            BuyerEmail = buyerEmail;
            ShipToAddress = shipToAddress != null ? new Address(shipToAddress) : null;
            DeliveryMethod = deliveryMethod;
            SubTotal = subTotal;
        }

        public string BuyerEmail { get; set; }
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;
        public Address ShipToAddress { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }
        public IReadOnlyList<OrderItem> OrderItems { get; set; }
        public decimal SubTotal { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public string PaymentIntentId { get; set; }

        // Note: If this instance is mapped to an DTO with a decimal property
        // named "Total" then AutoMapper will use GetTotal() method to populate it
        public decimal GetTotal()
        {
            return SubTotal + DeliveryMethod.Price;
        }
    }
}