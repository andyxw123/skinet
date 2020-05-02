using System.Linq;
using API.Errors;
using Microsoft.AspNetCore.Mvc;
using API.Helpers;
using AutoMapper;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.OpenApi.Models;
using Core.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace API.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddAutoMapperProfiles(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(AutoMapperProfiles));

            return services;
        }

        public static IServiceCollection AddDataContexts(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<StoreContext>(x =>
            {
                //x.UseLazyLoadingProxies();
                x.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            return services;
        }

        public static IServiceCollection AddRedisConfig(this IServiceCollection services, IConfiguration config)
        {
            services.AddSingleton<IConnectionMultiplexer>(c => {
                var configOptions = ConfigurationOptions.Parse(config.GetConnectionString("Redis"), ignoreUnknown: true);
                return ConnectionMultiplexer.Connect(configOptions);
            });

            return services;
        }

        public static IServiceCollection AppRepositories(this IServiceCollection services)
        {
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>)); // Note the empty angle brackets as the generic type isn't known yet
            services.AddScoped(typeof(IBasketRepository), typeof(BasketRepository));
            return services;
        }

        // Standardise ModelState validation errors in a ApiValidationErrorResponse instance - MUST be done AFTER .AddControllers()
        public static IServiceCollection AddApiValidationErrorResponseConfig(this IServiceCollection services)
        {
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = actionContext =>
                {
                    var errors = actionContext.ModelState
                        .Where(e => e.Value.Errors.Count > 0)
                        .SelectMany(x => x.Value.Errors)
                        .Select(x => x.ErrorMessage).ToArray();

                    var errorResponse = new ApiValidationErrorResponse { Errors = errors };

                    return new BadRequestObjectResult(errorResponse);
                };
            });

            return services;
        }
    }
}