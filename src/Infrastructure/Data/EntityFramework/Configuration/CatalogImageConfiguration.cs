using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class CatalogImageConfiguration : IEntityTypeConfiguration<CatalogImage>
    {
        public void Configure(EntityTypeBuilder<CatalogImage> builder)
        {

            builder.ToTable("CatalogImages");

            builder.HasKey(a => new { a.CatalogId, a.FileId });

            builder.HasOne(a => a.Catalog)
                .WithOne(a => a.CatalogImage)
                .HasForeignKey<CatalogImage>(a => a.CatalogId)
                .IsRequired();

            builder.HasOne(a => a.File)
               .WithOne()
               .HasForeignKey<CatalogImage>(a => a.FileId)
               .IsRequired();
        }
    }
}
