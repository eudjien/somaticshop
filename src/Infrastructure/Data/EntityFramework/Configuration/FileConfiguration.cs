using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityFramework.Configuration
{
    class FileConfiguration : IEntityTypeConfiguration<File>
    {
        public void Configure(EntityTypeBuilder<File> builder)
        {

            builder.ToTable("Files");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.FileName)
                .IsRequired();

            builder.Property(a => a.ContentType)
                .IsRequired(true);
        }
    }
}
