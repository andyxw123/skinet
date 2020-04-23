using Core.Classes;

namespace Core.Specifications
{
    public class ProductsFilterSpecParams : PaginationParams
    {
        public int? BrandId { get; set; }

        public int? TypeId { get; set; }

        private string _nameSearch;
        public string NameSearch
        {
            get => string.IsNullOrWhiteSpace(_nameSearch) ? null : _nameSearch.Trim().ToLower();
            set => _nameSearch = value;
        }
        
    }
}