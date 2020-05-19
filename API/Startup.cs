using System.IO;
using API.Extensions;
using API.Middleware;
using Core.Interfaces;
using Infrastructure.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
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

        public void ConfigureDevelopmentServices(IServiceCollection services)
        {
            services.AddDataContextsForDevelopment(_config);

            ConfigureServices(services);
        }

        public void ConfigureProductionServices(IServiceCollection services)
        {
            services.AddDataContextsForProduction(_config);

            ConfigureServices(services);
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            // Configure Cross Origin Requests policy
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
                });
            });

            // ../Extensions/IServiceCollectionExtensions.cs
            services.AddApiValidationErrorResponseConfig()
                .AddIdentityServices(_config)
                .AddRedisConfig(_config)
                .AddRepositories()
                .AddBusinessLogicServices()  // Business Logic for the application
                .AddAutoMapperProfiles()
                .AddSwaggerDocumentation();
        }


        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //NOTE: Ordering of the HTTP pipeline is important

            // Use the CORS policy configured in Services
            app.UseCors("CorsPolicy");

            // ../Extensions/IApplicationBuilderExtensions.cs
            app.UseErrorController()
                .UseExceptionMiddleware()
                .UseSwaggerDocumentation();

            app.UseRouting();

            // UseAuthentication MUST be before UseAuthorization
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Fallback");
            });

            // If there's problems with HTTPS in Chrome for development add the following to appsettings.Development.json
            // "Kestrel": {
            //    "EndpointDefaults": {
            //      "Protocols": "Http1"
            //    }
            //  }
            app.UseHttpsRedirection();

            // Enable serving of static files
            app.UseStaticFiles();

            app.UseStaticFiles(new StaticFileOptions {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "Content")
                ), RequestPath = "/content"
            });
        }
    }
}
