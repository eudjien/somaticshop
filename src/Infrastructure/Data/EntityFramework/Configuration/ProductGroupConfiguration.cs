using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class ProductGroupConfiguration : IEntityTypeConfiguration<ProductGroup>
    {
        public void Configure(EntityTypeBuilder<ProductGroup> builder)
        {
            builder.ToTable("ProductGroups");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Name)
                .IsRequired();

            builder.HasIndex(a => a.Name)
                .IsUnique(true);

            builder.HasMany(a => a.Products)
                .WithOne(a => a.Group)
                .HasForeignKey(a => a.GroupId)
                .IsRequired(false);
        }
    }
}
