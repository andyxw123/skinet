using System.Collections.Generic;
using Core.Interfaces;

namespace Core.Classes
{
    public class Pagination<T> where T : class
    {
        public Pagination()
        {
        }

        public Pagination(IPaginationParams paginationParams, int count, IEnumerable<T> data)
        {
            PageIndex = paginationParams.PageIndex;
            PageSize = paginationParams.PageSize;
            Count = count;
            Data = data;
        }

        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int Count { get; set; }
        public IEnumerable<T> Data { get; set; }
    }
}