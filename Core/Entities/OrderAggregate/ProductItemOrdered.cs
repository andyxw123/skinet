namespace Core.Entities.OrderAggregate
{
    public class ProductItemOrdered
    {
        public ProductItemOrdered()
        {
        }

        public ProductItemOrdered(Product product)
        {
            ProductItemId = product.Id;
            ProductName = product.Name;
            PictureUrl = product.PictureUrl;
        }

        public int ProductItemId { get; set; }
        public string ProductName { get; set; }
        public string PictureUrl { get; set; }
    }
}