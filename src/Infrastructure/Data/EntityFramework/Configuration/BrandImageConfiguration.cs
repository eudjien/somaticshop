using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class BrandImageConfiguration : IEntityTypeConfiguration<BrandImage>
    {
        public void Configure(EntityTypeBuilder<BrandImage> builder)
        {

            builder.ToTable("BrandImages");

            builder.HasKey(a => new { a.BrandId, a.FileId });

            builder.HasOne(a => a.Brand)
                .WithOne(a => a.BrandImage)
                .HasForeignKey<BrandImage>(a => a.BrandId)
                .IsRequired();

            builder.HasOne(a => a.File)
               .WithOne()
               .HasForeignKey<BrandImage>(a => a.FileId)
               .IsRequired();
        }
    }
}
