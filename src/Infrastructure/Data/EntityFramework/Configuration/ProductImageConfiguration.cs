using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class ProductImageConfiguration : IEntityTypeConfiguration<ProductImage>
    {
        public void Configure(EntityTypeBuilder<ProductImage> builder)
        {

            builder.ToTable("ProductImages");

            builder.HasKey(a => a.Id);

            builder.HasIndex(a => a.FileId).IsUnique();
            builder.Property(a => a.FileId).IsRequired();

            builder.HasOne(a => a.Product)
                .WithMany(a => a.Images)
                .HasForeignKey(a => a.ProductId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(a => a.File)
               .WithOne()
               .HasForeignKey<ProductImage>(a => a.FileId)
               .IsRequired()
               .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
