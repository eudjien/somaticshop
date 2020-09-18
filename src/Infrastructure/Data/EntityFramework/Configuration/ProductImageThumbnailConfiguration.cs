using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class ProductImageThumbnailConfiguration : IEntityTypeConfiguration<ProductImageThumbnail>
    {
        public void Configure(EntityTypeBuilder<ProductImageThumbnail> builder)
        {

            builder.ToTable("ProductImageThumbnails");

            builder.HasKey(a => a.Id);

            builder.HasIndex(a => a.FileId).IsUnique();
            builder.Property(a => a.FileId).IsRequired();

            builder.HasOne(a => a.Product)
                .WithOne(a => a.Thumbnail)
                .HasForeignKey<ProductImageThumbnail>(a => a.ProductId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(a => a.File)
               .WithOne()
               .HasForeignKey<ProductImageThumbnail>(a => a.FileId)
               .IsRequired();
        }
    }
}
