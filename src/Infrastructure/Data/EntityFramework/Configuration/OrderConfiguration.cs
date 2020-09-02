using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.ToTable("Orders");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Date)
                .IsRequired();

            builder.Property(a => a.Comment)
                .IsRequired(false);

            builder.Property(a => a.Status)
                .IsRequired();

            builder.HasOne(a => a.Buyer)
                .WithMany(a => a.Orders)
                .HasForeignKey(a => a.BuyerId)
                .IsRequired();

            builder.HasOne(a => a.Address)
                .WithMany(a => a.Orders)
                .HasForeignKey(a => a.AddressId)
                .IsRequired();
        }
    }
}
