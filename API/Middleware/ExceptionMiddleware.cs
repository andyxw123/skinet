using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using API.Errors;
using API.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _env = env;
            _logger = logger;
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                httpContext.Response.ContentType = "application/json";
                httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var  response = new ApiException(httpContext.Response.StatusCode);
                
                if (_env.IsDevelopment()) 
                {
                    response.Message = ex.Message;
                    response.Details = ex.StackTrace;
                }

                await httpContext.Response.WriteAsync(response.ToJson());
            }
        }
    }
}