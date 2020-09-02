using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class BrandConfiguration : IEntityTypeConfiguration<Brand>
    {
        public void Configure(EntityTypeBuilder<Brand> builder)
        {

            builder.ToTable("Brands");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Title)
                .IsRequired();

            builder.HasIndex(a => a.Title)
                .IsUnique();

            builder.Property(a => a.Content)
                .IsRequired(false);

            builder.HasMany(a => a.Products)
                .WithOne(a => a.Brand)
                .HasForeignKey(a => a.BrandId)
                .IsRequired(false);
        }
    }
}
