using Core.Entities;
using IdentityServer4.EntityFramework.Options;
using Infrastructure.Data.EntityFramework.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Infrastructure.Data.EntityFramework.Context
{
    public class AppDbContext : AppApiAuthorizationDbContext
    {
        public AppDbContext() { }

        public AppDbContext(
            DbContextOptions<AppDbContext> options)
            : base(options)
        { 
        }

        public AppDbContext(
            DbContextOptions<AppDbContext> options,
            IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {
        }

        protected override void OnModelCreating(ModelBuilder b)
        {
            base.OnModelCreating(b);

            b.ApplyConfiguration(new CatalogConfiguration());
            b.ApplyConfiguration(new CatalogImageConfiguration());

            b.ApplyConfiguration(new ProductConfiguration());
            b.ApplyConfiguration(new ProductGroupConfiguration());
            b.ApplyConfiguration(new ProductSpecConfiguration());
            b.ApplyConfiguration(new ProductSpecNameConfiguration());

            b.ApplyConfiguration(new ProductImageConfiguration());

            b.ApplyConfiguration(new BrandConfiguration());
            b.ApplyConfiguration(new BrandImageConfiguration());

            b.ApplyConfiguration(new OrderConfiguration());
            b.ApplyConfiguration(new OrderProductConfiguration());

            b.ApplyConfiguration(new BasketConfiguration());
            b.ApplyConfiguration(new BasketProductConfiguration());

            b.ApplyConfiguration(new AddressConfiguration());

            b.ApplyConfiguration(new BuyerConfiguration());

            b.ApplyConfiguration(new FileConfiguration());
        }

        public DbSet<Catalog> Catalogs { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductGroup> ProductGroups { get; set; }
        public DbSet<ProductSpec> ProductSpecs { get; set; }
        public DbSet<ProductSpecName> ProductSpecKeys { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderProduct> OrderProducts { get; set; }
        public DbSet<Basket> Baskets { get; set; }
        public DbSet<BasketProduct> BasketProducts { get; set; }
        public DbSet<Buyer> Buyers { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<BrandImage> BrandImages { get; set; }
        public DbSet<CatalogImage> CatalogImages { get; set; }
    }
}
