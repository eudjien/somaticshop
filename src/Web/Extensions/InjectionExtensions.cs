using Core;
using Core.Identity;
using Core.Identity.Entities;
using Core.Identity.Managers;
using Core.Identity.Repositories;
using Core.Interfaces;
using Core.Interfaces.Repositories;
using Core.Services;
using Infrastructure.Data.EntityFramework;
using Infrastructure.Data.EntityFramework.IdentityStores;
using Infrastructure.Data.EntityFramework.Repositories;
using Infrastructure.Data.EntityFramework.Repositories.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Web.Extensions
{
    public static class InjectionExtensions
    {
        public static IServiceCollection AddAppIdentity(this IServiceCollection services)
        {
            services.AddIdentity<User, Role>(o =>
            {
                o.Password.RequireDigit = true;
                o.Password.RequireLowercase = true;
                o.Password.RequireUppercase = true;
                o.Password.RequireNonAlphanumeric = false;
                o.Password.RequiredLength = 4;
                o.Password.RequiredUniqueChars = 2;
            })
                .AddRoleStore<EfRoleStore>()
                .AddUserStore<EfUserStore>()
                .AddRoleManager<AppRoleManager>()
                .AddUserManager<AppUserManager>()
                .AddSignInManager<SignInManager<User>>()
                .AddClaimsPrincipalFactory<AppUserClaimsPrincipalFactory>()
                .AddDefaultTokenProviders();
            return services;
        }

        public static IServiceCollection AppEfConfigure(this IServiceCollection services)
        {
            services.AddScoped<ICatalogRepository, EfCatalogRepository>();
            services.AddScoped<IOrderRepository, EfOrderRepository>();
            services.AddScoped<IOrderProductRepository, EfOrderProductRepository>();
            services.AddScoped<IBasketRepository, EfBasketRepository>();
            services.AddScoped<IBasketProductRepository, EfBasketProductRepository>();
            services.AddScoped<IProductRepository, EfProductRepository>();
            services.AddScoped<IProductSpecificationRepository, EfProductSpecificationRepository>();
            services.AddScoped<IProductGroupSpecificationRepository, EfProductGroupSpecificationRepository>();
            services.AddScoped<IProductSpecificationKeyRepository, EfProductSpecificationKeyRepository>();
            services.AddScoped<IProductGroupRepository, EfProductGroupRepository>();
            services.AddScoped<IBuyerRepository, EfBuyerRepository>();
            services.AddScoped<IBrandRepository, EfBrandRepository>();
            services.AddScoped<IAddressRepository, EfAddressRepository>();
            services.AddScoped<IFileRepository, EfFileRepository>();
            services.AddScoped<IProductImageRepository, EfProductImageRepository>();
            services.AddScoped<IProductImageThumbnailRepository, EfProductImageThumbnailRepository>();
            services.AddScoped<IBrandImageRepository, EfBrandImageRepository>();
            services.AddScoped<ICatalogImageRepository, EfCatalogImageRepository>();

            services.AddScoped<IUserRepository, EfUserRepository>();
            services.AddScoped<IRoleRepository, EfRoleRepository>();
            services.AddScoped<IUserClaimRepository, EfUserClaimRepository>();
            services.AddScoped<IRoleClaimRepository, EfRoleClaimRepository>();
            services.AddScoped<IUserLoginRepository, EfUserLoginRepository>();
            services.AddScoped<IUserTokenRepository, EfUserTokenRepository>();
            services.AddScoped<IUserRoleRepository, EfUserRoleRepository>();

            services.AddScoped<IUnitOfWork, EfUnitOfWork>();
            return services;
        }

        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            services.AddScoped<BasketService>();
            services.AddScoped<BrandService>();
            services.AddScoped<CatalogService>();
            services.AddScoped<ProductService>();
            services.AddScoped<OrderService>();
            services.AddScoped<UserService>();
            services.AddScoped<IStorage, FileService>();
            return services;
        }
    }
}
