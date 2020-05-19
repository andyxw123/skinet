using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        //The seed methods will be executed by the API so need to navigate back to the Infrastructure project accordingly

        public static async Task SeedAsync(StoreContext context)
        {
            //The seed data json files are copies to the output files (CopyToOutputDirectory="PreserveNewest" in Infrastructure.csproj)
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + "/Data/SeedData/";

            // When Seeding to SqlServer, need to switch on IDENTITY_INSERT for ProductBrands, ProductTypes and DeliveryMethods
            // before inserting as all these have their Ids populated in the json files.
            // This MUST be committed within a transaction otherwise the IDENTITY_INSERT option won't work.

            // ProductBrands
            if (!context.ProductBrands.Any())
            {
                using (var trans = context.Database.BeginTransaction())
                {
                    var brandsData = File.ReadAllText(path + "brands.json");

                    var brands = JsonSerializer.Deserialize<ProductBrand[]>(brandsData);
                    context.AddRange(brands);

                    await context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT dbo.ProductBrands ON");
                    await context.SaveChangesAsync();
                    await context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT dbo.ProductBrands OFF");
                    await trans.CommitAsync();
                }
            }

            // ProductTypes
            if (!context.ProductTypes.Any())
            {
                using (var trans = context.Database.BeginTransaction())
                {
                    var typesData = File.ReadAllText(path + "types.json");

                    var types = JsonSerializer.Deserialize<ProductType[]>(typesData);
                    context.AddRange(types);

                    await context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT dbo.ProductTypes ON");
                    await context.SaveChangesAsync();
                    await context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT dbo.ProductTypes OFF");
                    await trans.CommitAsync();
                }
            }

            // Products
            if (!context.Products.Any())
            {
                var productsData = File.ReadAllText(path + "products.json");
                var products = JsonSerializer.Deserialize<Product[]>(productsData);
                context.AddRange(products);
                await context.SaveChangesAsync();
            }

            // Delivery Methods
            if (!context.DeliveryMethods.Any())
            {
                using (var trans = context.Database.BeginTransaction())
                {
                    var deliveryData = File.ReadAllText(path + "delivery.json");

                    var deliveryMethods = JsonSerializer.Deserialize<DeliveryMethod[]>(deliveryData);

                    context.AddRange(deliveryMethods);
                    await context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT dbo.DeliveryMethods ON");
                    await context.SaveChangesAsync();
                    await context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT dbo.DeliveryMethods OFF");
                    await trans.CommitAsync();
                }
            }
        }
    }
}