using Core.Entities.OrderAggregate;

namespace Core.Specifications.Orders
{
    public class OrdersForBuyerSpec : BaseSpecification<Order>
    {
        public OrdersForBuyerSpec(string buyerEmail)
            : base(o => o.BuyerEmail == buyerEmail)

        {
            AddIncludes(o => o.OrderItems, o => o.DeliveryMethod);
            AddOrderByDescending(o => o.OrderDate);
        }

        public OrdersForBuyerSpec(int id, string buyerEmail) 
            : base(o => o.Id == id && o.BuyerEmail == buyerEmail)

        {
            AddIncludes(o => o.OrderItems, o => o.DeliveryMethod);
        }
    }
}