using System;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        //The seed methods will be executed by the API so need to navigate back to the Infrastructure project accordingly
        public static string SeedDataFolderPath = "../Infrastructure/Data/SeedData/";

        public static async Task SeedAsync(StoreContext context)
        {
            // ProductBrands
            if (!context.ProductBrands.Any())
            {
                var brandsData = File.ReadAllText(SeedDataFolderPath + "brands.json");

                var brands = JsonSerializer.Deserialize<ProductBrand[]>(brandsData);

                context.AddRange(brands);

                await context.SaveChangesAsync();
            }

            // ProductTypes
            if (!context.ProductTypes.Any())
            {
                var typesData = File.ReadAllText(SeedDataFolderPath + "types.json");

                var types = JsonSerializer.Deserialize<ProductType[]>(typesData);

                context.AddRange(types);

                await context.SaveChangesAsync();
            }

            // Products
            if (!context.Products.Any())
            {
                var productsData = File.ReadAllText(SeedDataFolderPath + "products.json");

                var products = JsonSerializer.Deserialize<Product[]>(productsData);

                context.AddRange(products);

                await context.SaveChangesAsync();
            }
        }
    }
}