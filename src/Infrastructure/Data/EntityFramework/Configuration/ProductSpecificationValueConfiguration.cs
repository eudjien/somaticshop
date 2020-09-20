using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class ProductSpecificationValueConfiguration : IEntityTypeConfiguration<ProductSpecificationValue>
    {
        public void Configure(EntityTypeBuilder<ProductSpecificationValue> builder)
        {
            builder.ToTable("ProductSpecificationValues");

            builder.HasKey(a => a.Id);

            builder.HasIndex(a => a.Value)
                .IsUnique();
            builder.Property(a => a.Value)
                .IsRequired();
        }
    }
}
