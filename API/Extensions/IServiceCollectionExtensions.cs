using System.Linq;
using API.Errors;
using Microsoft.AspNetCore.Mvc;
using API.Helpers;
using AutoMapper;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Core.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using Infrastructure.Identity;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Infrastructure.Services.Identity;
using Infrastructure.Services.BusinessLogic;

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

            services.AddDbContext<AppIdentityDbContext>(x => 
            {
                x.UseSqlite(config.GetConnectionString("IdentityConnection"));
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

        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped(typeof(IRepositoryUnitOfWork), typeof(StoreRepoUnitOfWork));
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

        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddScoped<ITokenService, TokenService>();

            var builder = services.AddIdentityCore<AppUser>();

            builder = new IdentityBuilder(builder.UserType, builder.Services);
            builder.AddEntityFrameworkStores<AppIdentityDbContext>();
            builder.AddSignInManager<SignInManager<AppUser>>();

            // Make Authentication aware of the JWT token so that requests can be authorised
            // (the token is generated by Infrastructure.Services.TokenService when the user registers/logs in)
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => 
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Token:Key"])),
                        ValidIssuer = config["Token:Issuer"],
                        ValidateIssuer = true,
                        ValidateAudience = false
                    };
                });

            return services;
        }

        public static IServiceCollection AddBusinessLogicServices(this IServiceCollection services)
        {
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IPaymentService, PaymentService>();

            return services;
        }
    }
}