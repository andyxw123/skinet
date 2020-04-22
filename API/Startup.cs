using API.Extensions;
using API.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;
        public Startup(IConfiguration config)
        {
            _config = config;
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            // The following are defined in ../Extenstions/IServiceCollectionExtensions.cs
            services.ConfigureApiValidationErrorResponse()
                .AddDataContexts(_config)
                .AddRepositories()
                .AddAutoMapperProfiles()
                .AddSwaggerDocumentation();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // ERROR HANDLING: Add own middleware to handle exceptions (500: Internal Server Error)
            app.UseMiddleware<ExceptionMiddleware>(); // ../Middleware/ExceptionMiddleware.cs

            // ERROR HANDLING: Add redirection to an error controller to standardise the response if the enpoint is not found
            app.UseStatusCodePagesWithReExecute("/errors/{0}");

            //Using HTTP in development as the self signed HTTPS certs doesn't work with Chrome
            if (!env.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }

            app.UseRouting();

            //Added to allow static content (images etc) to be served up
            app.UseStaticFiles();

            app.UseAuthorization();

            // API DOCUMENTATION (Also added in the ConfigureServices(..) method above)
            app.UseSwaggerDocumentation();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
