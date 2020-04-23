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
       private string _sort;
       public string Sort
       {
           get => _sort;
           set => _sort = string.IsNullOrWhiteSpace(value) ? null : value.Trim().ToLower();
       }
    }
}