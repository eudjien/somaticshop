using AutoMapper;
using Core.Dto;
using Core.Entities;
using Core.Identity.Entities;
using System;
using System.Linq.Expressions;

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

            CreateMap<ProductSpecificationDto, ProductSpecification>()
                .BeforeMap((src, dest) => {
                    dest.ProductSpecificationName ??= new ProductSpecificationName();
                    dest.ProductSpecificationValue ??= new ProductSpecificationValue();
                })
                .ForMember(dest => dest.Id, cfg => cfg.MapFrom(src => src.Id))
                .ForPath(dest => dest.ProductSpecificationName.Name, cfg => cfg.MapFrom(src => src.Name))
                .ForPath(dest => dest.ProductSpecificationValue.Value, cfg => cfg.MapFrom(src => src.Value))
                .ForPath(dest => dest.ProductSpecificationName.Id, cfg => cfg.MapFrom(src => src.NameId))
                .ForPath(dest => dest.ProductSpecificationValue.Id, cfg => cfg.MapFrom(src => src.ValueId))
                .ForMember(dest => dest.ProductId, cfg => cfg.MapFrom(src => src.ProductId));

            CreateMap<ProductSpecification, ProductSpecificationDto>()
                .ForMember(dest => dest.Id, cfg => cfg.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, cfg => cfg.MapFrom(src => src.ProductSpecificationName != null ? src.ProductSpecificationName.Name : null))
                .ForMember(dest => dest.Value, cfg => cfg.MapFrom(src => src.ProductSpecificationValue != null ? src.ProductSpecificationValue.Value : null))
                .ForMember(dest => dest.NameId, cfg => cfg.MapFrom(src => src.ProductSpecificationName != null ? src.ProductSpecificationName.Id : default))
                .ForMember(dest => dest.ValueId, cfg => cfg.MapFrom(src => src.ProductSpecificationValue != null ? src.ProductSpecificationValue.Id : default))
                .ForMember(dest => dest.ProductId, cfg => cfg.MapFrom(src => src.ProductId));

            //dest.Id = src.Id;
            //dest.Name = src.ProductSpecificationName?.Name;
            //dest.Value = src.ProductSpecificationValue?.Value;
            //dest.ProductSpecificationNameId = src.ProductSpecificationName?.Id ?? default;
            //dest.ProductSpecificationValueId = src.ProductSpecificationValue?.Id ?? default;
            //dest.ProductId = src.ProductId;

            CreateMap<ProductSpecificationNameDto, ProductSpecificationName>();
            CreateMap<ProductSpecificationName, ProductSpecificationNameDto>();

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
