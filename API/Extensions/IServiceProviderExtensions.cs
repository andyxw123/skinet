using System;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Identity;
using Core.Entities.Identity;
using Infrastructure.Identity;

namespace API.Extensions
{
    public static class IServiceProviderExtension
    {
        public async static Task<IServiceProvider> MigrateStoreContexteAndSeedData(this IServiceProvider services, bool isSeedingData = false)
        {
                var context = services.GetRequiredService<StoreContext>();
                await context.Database.MigrateAsync();

                if (isSeedingData)
                {
                    await StoreContextSeed.SeedAsync(context);
                }

            return services;
        }

        public async static Task<IServiceProvider> MigrateAppIdentityDbContextAndSeedData(this IServiceProvider services, bool isSeedingData = false)
        {
            var userManager = services.GetRequiredService<UserManager<AppUser>>();
            var identityContext = services.GetRequiredService<AppIdentityDbContext>();

            await identityContext.Database.MigrateAsync();

            if (isSeedingData)
            {
                await AppIdentityDbContextSeed.SeedUsersAsyc(userManager);
            }

            return services;
        }
    }
}