using System;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Interfaces;
using StackExchange.Redis;

namespace Infrastructure.Services
{
    public class ResponseCacheService : IResponseCacheService
    {
        private readonly IDatabase _database;

        public ResponseCacheService(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
        }

        public async Task CacheResponseAsync(string cacheKey, object response, TimeSpan expiry)
        {
            if (response == null)
            {
                return;
            }

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            var responseJson = JsonSerializer.Serialize(response, options);

            await _database.StringSetAsync(cacheKey, responseJson, expiry);
        }

        public async Task<string> GetCachedResponseAsync(string cacheKey)
        {
            var responseJson = await _database.StringGetAsync(cacheKey);

            if (responseJson.IsNullOrEmpty)
            {
                return null;
            }

            return responseJson;
        }
    }
}