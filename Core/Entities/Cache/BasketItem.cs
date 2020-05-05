namespace Core.Entities.Cache
{
    public class BasketItem : BaseNamedEntity
    {
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string PictureUrl { get; set; }
        public string ProductType { get; set; }
        public string ProductBrand { get; set; }
        public int Quantity { get; set; }
    }

}