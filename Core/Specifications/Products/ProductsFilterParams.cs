using Core.Classes;

namespace Core.Specifications.Products
{
    public class ProductsFilterParams : PaginationParams
    {
        public int? BrandId { get; set; }

        public int? TypeId { get; set; }

        private string _nameSearch;
        public string NameSearch
        {
            get => _nameSearch;
            set => _nameSearch = string.IsNullOrWhiteSpace(value) ? null : value.Trim().ToLower();
        }
        
    }
}