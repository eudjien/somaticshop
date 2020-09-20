using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class ProductSpecificationNameConfiguration : IEntityTypeConfiguration<ProductSpecificationName>
    {
        public void Configure(EntityTypeBuilder<ProductSpecificationName> builder)
        {
            builder.ToTable("ProductSpecificationNames");

            builder.HasKey(a => a.Id);

            builder.HasIndex(a => a.Name)
                .IsUnique();
            builder.Property(a => a.Name)
                .IsRequired();
        }
    }
}
