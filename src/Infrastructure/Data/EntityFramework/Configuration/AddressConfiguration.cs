using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class AddressConfiguration : IEntityTypeConfiguration<Address>
    {
        public void Configure(EntityTypeBuilder<Address> builder)
        {

            builder.ToTable("Addresses");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.AddressText)
                .IsRequired();

            builder.Property(a => a.PostalCode)
                .IsRequired(false);
        }
    }
}
