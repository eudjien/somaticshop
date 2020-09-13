using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class ProductSpecNameConfiguration : IEntityTypeConfiguration<ProductSpecName>
    {
        public void Configure(EntityTypeBuilder<ProductSpecName> builder)
        {
            builder.ToTable("ProductSpecNames");

            builder.HasKey(a => a.Id);

            builder.HasIndex(a => a.Name)
                .IsUnique();
            builder.Property(a => a.Name)
                .IsRequired();

            builder.HasMany(a => a.ProductSpecs)
                .WithOne(a => a.ProductSpecName)
                .HasForeignKey(a => a.ProductSpecNameId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        }
    }
}
