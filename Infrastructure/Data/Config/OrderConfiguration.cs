using Core.Entities.OrderAggregate;
using Core.Entities.OrderAggregate.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Infrastructure.Data.Config
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            // OwnsOne... indicate that the Address forms part of Order entity (rather than a relationship)
            // Properties will be named ShipToAddress_Street, ShipToAddress_City etc
            builder.OwnsOne(o => o.ShipToAddress, a => 
            {
                a.WithOwner();
            });

            // Use HasConversion to save OrderStatus in the database as its string name (rather than as a int)
            // The second expression deals with conversion back to the model by parsing the string to an enum
            builder.Property(s => s.Status)
                .HasConversion(
                    o => o.ToString(),
                    o => (OrderStatus) Enum.Parse(typeof(OrderStatus), o)
                );

            // Declare 1:Many relationship for OrderItems and cascading delete
            builder.HasMany(o => o.OrderItems).WithOne().OnDelete(DeleteBehavior.Cascade);
        }
    }
}