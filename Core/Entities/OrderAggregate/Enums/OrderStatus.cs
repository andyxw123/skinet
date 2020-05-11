using System.Runtime.Serialization;

namespace Core.Entities.OrderAggregate.Enums
{
    public enum OrderStatus
    {
        [EnumMember(Value = "Pending")]
        Pending = 0,
        [EnumMember(Value = "Payment Received")]
        PaymentReceived,
        [EnumMember(Value = "Payment Failed")]
        PaymentFailed
    }
}