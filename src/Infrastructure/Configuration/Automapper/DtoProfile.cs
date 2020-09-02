using AutoMapper;
using Core.Dto;
using Core.Entities;
using Core.Identity.Entities;
using System;

namespace Infrastructure.Configuration.Automapper
{
    public class DtoProfile : Profile
    {
        public DtoProfile()
        {
            AllowNullCollections = true;
            AllowNullDestinationValues = true;

            CreateMap<BrandDto, Brand>();
            CreateMap<Brand, BrandDto>();

            CreateMap<BuyerDto, Buyer>();
            CreateMap<Buyer, BuyerDto>();

            CreateMap<OrderDto, Order>().ForMember(dest => dest.Date, cfg => cfg.MapFrom(src => DateTimeOffset.Parse(src.Date)));
            CreateMap<Order, OrderDto>().ForMember(dest => dest.Date, cfg => cfg.MapFrom(src => src.Date.GetValueOrDefault().ToString("s")));

            CreateMap<OrderProductDto, OrderProduct>();
            CreateMap<OrderProduct, OrderProductDto>();

            CreateMap<AddressDto, Address>();
            CreateMap<Address, AddressDto>();

            CreateMap<UserDto, User>();
            CreateMap<User, UserDto>();

            CreateMap<CatalogDto, Catalog>();
            CreateMap<Catalog, CatalogDto>();

            CreateMap<ProductDto, Product>().ForMember(dest => dest.Date, cfg => cfg.MapFrom(src => DateTimeOffset.Parse(src.Date)));
            CreateMap<Product, ProductDto>().ForMember(dest => dest.Date, cfg => cfg.MapFrom(src => src.Date.ToString("s")));

            CreateMap<ProductGroupDto, ProductGroup>();
            CreateMap<ProductGroup, ProductGroupDto>();

            CreateMap<ProductSpecDto, ProductSpec>();
            CreateMap<ProductSpec, ProductSpecDto>();

            CreateMap<FileDto, File>();
            CreateMap<File, FileDto>();

            CreateMap<BasketDto, Basket>();
            CreateMap<Basket, BasketDto>();

            CreateMap<BasketProductDto, BasketProduct>();
            CreateMap<BasketProduct, BasketProductDto>();

            CreateMap<BrandImageDto, BrandImage>();
            CreateMap<BrandImage, BrandImageDto>();

            CreateMap<CatalogImageDto, CatalogImage>();
            CreateMap<CatalogImage, CatalogImageDto>();
        }
    }
}
