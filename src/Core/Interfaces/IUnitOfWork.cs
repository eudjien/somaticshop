using Core.Identity.Repositories;
using Core.Interfaces;
using Core.Interfaces.Repositories;
using System.Threading.Tasks;

namespace Core
{
    public interface IUnitOfWork
    {
        ICatalogRepository CatalogRepository { get; }
        IProductRepository ProductRepository { get; }
        IProductGroupRepository ProductGroupRepository { get; }
        IProductSpecRepository ProductSpecRepository { get; }
        IOrderRepository OrderRepository { get; }
        IOrderProductRepository OrderProductRepository { get; }
        IBasketRepository BasketRepository { get; }
        IBasketProductRepository BasketProductRepository { get; }
        IBrandRepository BrandRepository { get; }
        IBuyerRepository BuyerRepository { get; }
        IAddressRepository AddressRepository { get; }
        IFileRepository FileRepository { get; }
        IProductImageRepository ProductImageRepository { get; }
        IBrandImageRepository BrandImageRepository { get; }
        ICatalogImageRepository CatalogImageRepository { get; }

        //Identity
        IUserRepository UserRepository { get; }
        IRoleRepository RoleRepository { get; }
        IUserClaimRepository UserClaimRepository { get; }
        IRoleClaimRepository RoleClaimRepository { get; }
        IUserLoginRepository UserLoginRepository { get; }
        IUserTokenRepository UserTokenRepository { get; }
        IUserRoleRepository UserRoleRepository { get; }

        int SaveChanges();
        Task<int> SaveChangesAsync();

        Task<ITransaction> BeginTransactionAsync();
    }
}
