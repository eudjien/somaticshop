using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class ProductSpecificationConfiguration : IEntityTypeConfiguration<ProductSpecification>
    {
        public void Configure(EntityTypeBuilder<ProductSpecification> builder)
        {
            builder.ToTable("ProductSpecifications");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Value)
                .IsRequired(false);

            builder.HasOne(a => a.Product)
                .WithMany(a => a.Specifications)
                .HasForeignKey(a => a.ProductId)
                .IsRequired();
        }
    }
}
