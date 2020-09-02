using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class BasketProductConfiguration : IEntityTypeConfiguration<BasketProduct>
    {
        public void Configure(EntityTypeBuilder<BasketProduct> builder)
        {

            builder.ToTable("BasketProducts");

            builder.HasKey(a => new { a.BasketId, a.ProductId });

            builder.Property(a => a.Quantity)
                .HasDefaultValue(1)
                .IsRequired();

            builder.Property(a => a.UnitPrice)
                .HasColumnType(nameof(Decimal))
                .IsRequired();

            builder.HasOne(a => a.Basket)
                .WithMany(a => a.BasketProducts)
                .HasForeignKey(a => a.BasketId);

            builder.HasOne(a => a.Product)
                .WithMany()
                .HasForeignKey(a => a.ProductId);
        }
    }
}
