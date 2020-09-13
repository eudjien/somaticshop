using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class CatalogConfiguration : IEntityTypeConfiguration<Catalog>
    {
        public void Configure(EntityTypeBuilder<Catalog> builder)
        {

            builder.ToTable("Catalogs");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Name)
                .IsRequired();

            builder.HasOne(a => a.ParentCatalog)
                .WithMany(a => a.ChildCatalogs)
                .HasForeignKey(a => a.ParentCatalogId)
                .IsRequired(false);
        }
    }
}
