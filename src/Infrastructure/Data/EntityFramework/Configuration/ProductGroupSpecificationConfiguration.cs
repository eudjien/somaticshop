using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class ProductGroupSpecificationConfiguration : IEntityTypeConfiguration<ProductGroupSpecification>
    {
        public void Configure(EntityTypeBuilder<ProductGroupSpecification> builder)
        {
            builder.ToTable("ProductGroupSpecifications");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Value)
                .IsRequired(false);

            builder.HasOne(a => a.ProductGroup)
                .WithMany(a => a.Specifications)
                .HasForeignKey(a => a.ProductGroupId)
                .IsRequired();
        }
    }
}
