using System.Text.Json;

namespace API.Extensions
{
    public static class ObjectExtensions
    {
        public static string ToJson<T>(this T source)
            where T : class
        {
            var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            return JsonSerializer.Serialize(source, jsonOptions);
        }
    }
}