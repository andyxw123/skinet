using API.Middleware;
using Microsoft.AspNetCore.Builder;

namespace API.Extensions
{
    public static class IApplicationBuilderExtensions
    {
        public static IApplicationBuilder AddExceptionMiddleware(this IApplicationBuilder app)
        {
            // ERROR HANDLING: Add own middleware to handle exceptions (500: Internal Server Error)
            app.UseMiddleware<ExceptionMiddleware>(); // ../Middleware/ExceptionMiddleware.cs

            return app;
        }

        public static IApplicationBuilder UseErrorController(this IApplicationBuilder app)
        {
            // ERROR HANDLING: Add redirection to an error controller to standardise the response if the enpoint is not found
            app.UseStatusCodePagesWithReExecute("/errors/{0}");

            return app;
        }
    }
}