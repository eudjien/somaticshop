using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("Products");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Name)
                .IsRequired();

            builder.HasIndex(a => a.Name)
                .IsUnique(false);

            builder.Property(a => a.Content)
                .IsRequired();

            builder.Property(a => a.Description)
            .IsRequired(false);

            builder.Property(a => a.Price)
                .HasColumnType(nameof(Decimal))
                .IsRequired();

            builder.Property(a => a.Date)
                .IsRequired();

            builder.HasOne(a => a.Catalog)
                .WithMany(a => a.Products)
                .HasForeignKey(a => a.CatalogId)
                .IsRequired(false);

            builder.HasOne(a => a.Brand)
               .WithMany(a => a.Products)
               .HasForeignKey(a => a.BrandId)
               .IsRequired(false);
        }
    }
}
