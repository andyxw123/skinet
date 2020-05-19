using System;
using System.Threading.Tasks;
using API.Extensions;
using Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            // Enabled automatic database migration on startup
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var environment = services.GetService<IWebHostEnvironment>();
                var loggerFactory = services.GetRequiredService<ILoggerFactory>();
                var logger = loggerFactory.CreateLogger<Program>();

                // ../Extensions/IServiceProviderExtensions.cs
                try
                {
                    await services.MigrateAppIdentityDbContextAndSeedData(isSeedingData: environment.IsDevelopment());
                    await services.MigrateStoreContexteAndSeedData(isSeedingData: true); //environment.IsDevelopment());
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occured during IdentityContext migration");
                }

            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
