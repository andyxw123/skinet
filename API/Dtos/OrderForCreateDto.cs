namespace API.Dtos
{
    public class OrderForCreateDto
    {
        public string BasketId { get; set; }

        public int DeliveryMethodId { get; set; }

        public AddressDto ShipToAddress { get; set; }
    }
}