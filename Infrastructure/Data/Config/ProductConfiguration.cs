using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        // This configuration is applied by overriding OnModelCreating(..) in StoreContext (ApplyConfigurationsFromAssembly)
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.Property(p => p.Name).IsRequired().HasMaxLength(100);

            // Specify non-nullable strings and max lengths
            builder.Property(p => p.Description).IsRequired();
            builder.Property(p => p.Name).IsRequired().HasMaxLength(100);
            builder.Property(p => p.PictureUrl).IsRequired();

            // Specify column as a decimal type with 2 decimal places
            builder.Property(p => p.Price).HasColumnType("decimal(18, 2)");

            // Can also specify relationships - not strictly needed as EF will handle this based on the entity's ids and navigation properties
            builder.HasOne(p => p.ProductBrand).WithMany().HasForeignKey(p => p.ProductBrandId);
            builder.HasOne(p => p.ProductType).WithMany().HasForeignKey(p => p.ProductTypeId);
        }
    }
}