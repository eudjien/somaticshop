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

            builder.HasOne(a => a.ProductSpecificationName)
             .WithMany(a => a.ProductSpecifications)
             .HasForeignKey(a => a.ProductSpecificationNameId)
             .IsRequired();

            builder.HasOne(a => a.ProductSpecificationValue)
             .WithMany(a => a.ProductSpecifications)
             .HasForeignKey(a => a.ProductSpecificationValueId)
             .IsRequired();

            builder.HasOne(a => a.Product)
             .WithMany(a => a.Specifications)
             .HasForeignKey(a => a.ProductId)
             .IsRequired();
        }
    }
}
