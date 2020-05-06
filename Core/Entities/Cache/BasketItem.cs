namespace Core.Entities.Cache
{
    public class BasketItem : BaseNamedEntity
    {
        public decimal Price { get; set; }
        public string PictureUrl { get; set; }
        public int Quantity { get; set; }
    }

}