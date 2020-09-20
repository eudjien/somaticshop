using Core.Identity.Repositories;
using Core.Interfaces.Repositories;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public abstract class UnitOfWorkBase : IUnitOfWork
    {
        public ICatalogRepository CatalogRepository { get; protected set; }
        public IOrderRepository OrderRepository { get; protected set; }
        public IOrderProductRepository OrderProductRepository { get; protected set; }
        public IBasketRepository BasketRepository { get; protected set; }
        public IBasketProductRepository BasketProductRepository { get; protected set; }
        public IProductRepository ProductRepository { get; protected set; }
        public IProductGroupRepository ProductGroupRepository { get; protected set; }
        public IProductSpecificationRepository ProductSpecificationRepository { get; protected set; }
        public IProductGroupSpecificationRepository ProductGroupSpecificationRepository { get; protected set; }
        public IProductSpecificationNameRepository ProductSpecificationNameRepository { get; protected set; }
        public IProductSpecificationValueRepository ProductSpecificationValueRepository { get; protected set; }
        public IBuyerRepository BuyerRepository { get; protected set; }
        public IBrandRepository BrandRepository { get; protected set; }
        public IAddressRepository AddressRepository { get; protected set; }
        public IFileRepository FileRepository { get; protected set; }
        public IProductImageRepository ProductImageRepository { get; protected set; }
        public IProductImageThumbnailRepository ProductImageThumbnailRepository { get; protected set; }
        public IBrandImageRepository BrandImageRepository { get; protected set; }
        public ICatalogImageRepository CatalogImageRepository { get; protected set; }

        // identity
        public IUserRepository UserRepository { get; protected set; }
        public IRoleRepository RoleRepository { get; protected set; }
        public IUserClaimRepository UserClaimRepository { get; protected set; }
        public IRoleClaimRepository RoleClaimRepository { get; protected set; }
        public IUserLoginRepository UserLoginRepository { get; protected set; }
        public IUserTokenRepository UserTokenRepository { get; protected set; }
        public IUserRoleRepository UserRoleRepository { get; protected set; }

        public abstract Task<ITransaction> BeginTransactionAsync();

        public abstract int SaveChanges();

        public abstract Task<int> SaveChangesAsync();
    }
}
