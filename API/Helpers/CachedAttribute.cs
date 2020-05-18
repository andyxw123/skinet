using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace API.Helpers
{
    public class CachedAttribute : Attribute, IAsyncActionFilter
    {
        private readonly int _expiryInSeconds;
        public CachedAttribute(int expiryInSeconds)
        {
            _expiryInSeconds = expiryInSeconds;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // This happens before the controller is hit - check if there's a an existing cached response 
            var cacheService = context.HttpContext.RequestServices.GetRequiredService<IResponseCacheService>();

            //The cache key will be built from the request's path and querystring parameters
            var cacheKey = GenerateCacheKeyFromRequest(context.HttpContext.Request);

            var cachedResponse = await cacheService.GetCachedResponseAsync(cacheKey);

            if (!string.IsNullOrEmpty(cachedResponse))
            {
                // Add the cached result to the context
                var contentResult = new ContentResult
                {
                    Content = cachedResponse,
                    ContentType = "application/json",
                    StatusCode = 200
                };

                context.Result = contentResult;

                // Return here - controller action won't be executed - the cached result will just be returned
                return;
            }

            // No cached result was received, so await the result of the intended controller action
            var executedContext = await next();

            //NOTE: The controller action must return the result inside an OkObjectResult i.e. Ok(result)
            if (executedContext.Result is OkObjectResult okObjectResult)
            {
                // The controller action produced a successful response - add it to the cache
                await cacheService.CacheResponseAsync(cacheKey, okObjectResult.Value, TimeSpan.FromSeconds(_expiryInSeconds));
            }
        }

        private string GenerateCacheKeyFromRequest(HttpRequest request)
        {
            var keyBuilder = new StringBuilder();

            keyBuilder.Append($"{request.Path}");

            foreach (var (key, value) in request.Query.OrderBy(x => x.Key))
            {
                keyBuilder.Append($"|{key}-{value}");
            }

            return keyBuilder.ToString();
        }
    }
}