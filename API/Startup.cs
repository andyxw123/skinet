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
                .AddDataContexts(_config)
                .AddRedisConfig(_config)
                .AppRepositories()
                .AddAutoMapperProfiles()
                .AddSwaggerDocumentation();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
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

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
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
        }
    }
}
