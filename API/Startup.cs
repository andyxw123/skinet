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
            services.AddConfigureApiValidationErrorResponse()
                .AddDataContexts(_config)
                .AppRepositories()
                .AddAutoMapperProfiles()
                .AddSwaggerDocumentation();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseRouting();

            // Use the CORS policy configured in Services
            app.UseCors("CorsPolicy");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            // Enable serving of static files
            app.UseStaticFiles();

            //Using HTTP in development as the self signed HTTPS certs doesn't work with Chrome
            if (!env.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }

            // ../Extensions/IApplicationBuilderExtensions.cs
            app.AddExceptionMiddleware()
                .UseErrorController()
                .UseSwaggerDocumentation();
        }
    }
}
