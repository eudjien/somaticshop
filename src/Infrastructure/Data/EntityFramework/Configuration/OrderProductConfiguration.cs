using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class OrderProductConfiguration : IEntityTypeConfiguration<OrderProduct>
    {
        public void Configure(EntityTypeBuilder<OrderProduct> builder)
        {
            builder.ToTable("OrderProducts");

            builder.HasKey(a => new { a.OrderId, a.ProductId });

            builder.Property(a => a.Quantity)
                .HasDefaultValue(1)
                .IsRequired();

            builder.Property(a => a.UnitPrice)
               .HasColumnType(nameof(Decimal))
               .IsRequired();

            builder.HasOne(a => a.Order)
                .WithMany(a => a.OrderProducts)
                .HasForeignKey(a => a.OrderId)
                .IsRequired();

            builder.HasOne(a => a.Product)
                .WithMany(a => a.OrderProducts)
                .HasForeignKey(a => a.ProductId);

        }
    }
}
