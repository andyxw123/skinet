using Core.Interfaces;

namespace Core.Classes
{
    public class PaginationParams : IPaginationParams
    {
        private const int MaxPageSize = 50;
        public int PageIndex { get; set; } = 1;
        private int _pageSize = 10;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = value < 50 ? value : MaxPageSize;
        }
        public string Sort { get; set; }
        public string SortToLower()
        {
            return string.IsNullOrWhiteSpace(Sort) ? null : Sort.Trim().ToLower();
        }
    }
}