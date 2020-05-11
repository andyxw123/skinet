using System;
using System.Linq;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions<StoreContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

        public DbSet<ProductBrand> ProductBrands { get; set; }

        public DbSet<ProductType> ProductTypes { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<OrderItem> OrderItems { get; set; }

        public DbSet<DeliveryMethod> DeliveryMethods { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Applies all config classes that implement IEntityTypeConfiguration
            modelBuilder.ApplyConfigurationsFromAssembly(this.GetType().Assembly);

            SqliteConvertUnsupportedPropertyTypes(modelBuilder);
        }

        private void SqliteConvertUnsupportedPropertyTypes(ModelBuilder modelBuilder)
        {
            // Sqlite doesn't support certain property types so convert where needed
            if (Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
            {
                foreach (var entityType in modelBuilder.Model.GetEntityTypes())
                {
                    // Decimal to Double
                    var decimalProperties = entityType.ClrType.GetProperties().Where(x => x.PropertyType == typeof(decimal));

                    foreach (var property in decimalProperties)
                    {
                        modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
                    }

                    // DateTimeOffset to DateTime
                    var dateTimOffsetProperties = entityType.ClrType.GetProperties().Where(x => x.PropertyType == typeof(DateTimeOffset));

                    foreach (var property in dateTimOffsetProperties)
                    {
                        modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion(new DateTimeOffsetToBinaryConverter());
                    }

                }
            }
        }
    }
}