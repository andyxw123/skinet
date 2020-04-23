using System;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;


namespace API.Extensions
{
    public static class IServiceProviderExtension
    {
        public async static Task<IServiceProvider> MigrateDatabaseAndSeedData(this IServiceProvider services, ILoggerFactory loggerFactory, bool isSeedingData = false)
        {
            try
            {
                var context = services.GetRequiredService<StoreContext>();
                await context.Database.MigrateAsync();

                if (isSeedingData)
                {
                    await StoreContextSeed.SeedAsync(context, loggerFactory);
                }
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<Program>();
                logger.LogError(ex, "An error occured during database migration");
            }

            return services;
        }
    }
}