using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class BasketConfiguration : IEntityTypeConfiguration<Basket>
    {
        public void Configure(EntityTypeBuilder<Basket> builder)
        {

            builder.ToTable("Baskets");

            builder.HasKey(basket => basket.Id);
            builder.HasIndex(basket => basket.UserOrAnonymousId).IsUnique();
            builder.Property(basket => basket.UserOrAnonymousId).IsRequired();
        }
    }
}
