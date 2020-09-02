using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class ProductSpecConfiguration : IEntityTypeConfiguration<ProductSpec>
    {
        public void Configure(EntityTypeBuilder<ProductSpec> builder)
        {
            builder.ToTable("ProductSpecs");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Key)
                .IsRequired();

            builder.Property(a => a.Value)
                .IsRequired(false);

            builder.HasOne(a => a.Product)
                .WithMany(a => a.Specifications)
                .HasForeignKey(a => a.ProductId)
                .IsRequired();
        }
    }
}
