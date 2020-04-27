using System.Text.Json;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpResponseExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, IPaginationInfo paginationInfo)
        {
            response.Headers.Add("Pagination", paginationInfo.ToJson());
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}