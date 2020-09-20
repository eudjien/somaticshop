using Core.Interfaces;
using IdentityServer4.EntityFramework.Options;
using Infrastructure.Data.EntityFramework.Context;
using Infrastructure.Data.EntityFramework.Repositories;
using Infrastructure.Data.EntityFramework.Repositories.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework
{
    public class EfUnitOfWork : UnitOfWorkBase, IDisposable
    {
        private readonly AppDbContext _dbContext;

        public EfUnitOfWork(
            DbContextOptions<AppDbContext> dbContext,
            IOptions<OperationalStoreOptions> operationalStoreOptions)
        {
            _dbContext = new AppDbContext(dbContext, operationalStoreOptions);

            CatalogRepository = new EfCatalogRepository(_dbContext);
            ProductRepository = new EfProductRepository(_dbContext);
            ProductGroupRepository = new EfProductGroupRepository(_dbContext);
            ProductSpecificationRepository = new EfProductSpecificationRepository(_dbContext);
            ProductGroupSpecificationRepository = new EfProductGroupSpecificationRepository(_dbContext);
            ProductSpecificationNameRepository = new EfProductSpecificationNameRepository(_dbContext);
            ProductSpecificationValueRepository = new EfProductSpecificationValueRepository(_dbContext);
            BrandRepository = new EfBrandRepository(_dbContext);
            OrderRepository = new EfOrderRepository(_dbContext);
            OrderProductRepository = new EfOrderProductRepository(_dbContext);
            BasketRepository = new EfBasketRepository(_dbContext);
            BasketProductRepository = new EfBasketProductRepository(_dbContext);
            BuyerRepository = new EfBuyerRepository(_dbContext);
            FileRepository = new EfFileRepository(_dbContext);
            ProductImageRepository = new EfProductImageRepository(_dbContext);
            ProductImageThumbnailRepository = new EfProductImageThumbnailRepository(_dbContext);
            BrandImageRepository = new EfBrandImageRepository(_dbContext);
            CatalogImageRepository = new EfCatalogImageRepository(_dbContext);
            AddressRepository = new EfAddressRepository(_dbContext);

            UserRepository = new EfUserRepository(_dbContext);
            RoleRepository = new EfRoleRepository(_dbContext);
            UserClaimRepository = new EfUserClaimRepository(_dbContext);
            RoleClaimRepository = new EfRoleClaimRepository(_dbContext);
            UserLoginRepository = new EfUserLoginRepository(_dbContext);
            UserTokenRepository = new EfUserTokenRepository(_dbContext);
            UserRoleRepository = new EfUserRoleRepository(_dbContext);
        }

        public override async Task<ITransaction> BeginTransactionAsync()
        {
            return new EfTransactionAdapter(await _dbContext.Database.BeginTransactionAsync());
        }

        public override int SaveChanges()
        {
            return _dbContext.SaveChanges();
        }

        public override Task<int> SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }

        public void Dispose()
        {
            _dbContext.Dispose();
        }
    }
}
