using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class BuyerConfiguration : IEntityTypeConfiguration<Buyer>
    {
        public void Configure(EntityTypeBuilder<Buyer> builder)
        {

            builder.ToTable("Buyers");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.UserOrAnonymousId).IsRequired();
        }
    }
}
