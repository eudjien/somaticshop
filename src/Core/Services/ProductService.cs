using AutoMapper;
using Core.Common;
using Core.Dto;
using Core.Entities;
using Core.Exceptions;
using Core.Interfaces;
using Core.Specifications.ProductSpecs;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Services
{
    public class ProductService : ServiceBase
    {

        private readonly IStorage _storage;

        public ProductService(IUnitOfWork unitOfWork, IStorage storage, IMapper mapper, ILogger<ProductService> logger)
            : base(unitOfWork, mapper, logger)
        {
            _storage = storage ?? throw new ArgumentNullException(nameof(storage));
        }

        public async Task CreateProductAsync(
            ProductDto productDto,
            IEnumerable<FileData> imageDatas = null,
            IEnumerable<ProductSpecDto> productSpecDtos = null)
        {
            if (imageDatas != null)
            {
                ThrowIfImageIsNotValid(imageDatas.Select(a => a.Stream).ToArray());
            }

            productDto.Date = DateTimeOffset.Now.ToString();
            var product = Mapper.Map<Product>(productDto);

            if (imageDatas != null && imageDatas.Any())
            {
                var newProductImages = ImagesFromData(imageDatas);
                product.Images = newProductImages.Select(a => a.Key).ToList();

                foreach (var newProductImage in newProductImages)
                {
                    _storage.Write(newProductImage.Key.File, newProductImage.Value);
                }
            }

            if (productSpecDtos != null && productSpecDtos.Any())
            {
                var newProductSpecs = Mapper.Map<IEnumerable<ProductSpec>>(productSpecDtos);
                product.Specifications = newProductSpecs.ToList();
            }

            UnitOfWork.ProductRepository.Add(product);
            await UnitOfWork.SaveChangesAsync();
            productDto.Id = product.Id;
        }

        public async Task UpdateProductAsync(
            ProductDto productDto,
            IEnumerable<FileData> imageDatas = null,
            IEnumerable<ProductSpecDto> productSpecDtos = null)
        {
            var existProduct = await GetProductWithAllIncludesAsync(productDto.Id);
            if (existProduct is null)
            {
                throw new NotFoundException($"Product with id: {productDto.Id} not found.");
            }

            if (imageDatas != null)
            {
                ThrowIfImageIsNotValid(imageDatas.Select(a => a.Stream).ToArray());
            }

            if (existProduct.Images != null)
            {
                UnitOfWork.FileRepository.RemoveRange(existProduct.Images.Select(a => a.File));

                foreach (var productImage in existProduct.Images)
                {
                    _storage.Delete(productImage.File);
                }
            }

            if (imageDatas != null)
            {
                var newProductImages = ImagesFromData(imageDatas);

                foreach (var newProductImage in newProductImages)
                {
                    _storage.Write(newProductImage.Key.File, newProductImage.Value);
                }

                existProduct.Images = newProductImages.Select(a => a.Key).ToList();
            }
            else
            {
                existProduct.Images = null;
            }

            existProduct.Specifications = Mapper.Map<IEnumerable<ProductSpec>>(productSpecDtos).ToList();

            Mapper.Map(productDto, existProduct);
            UnitOfWork.ProductRepository.Update(existProduct);
            await UnitOfWork.SaveChangesAsync();
            productDto.Id = existProduct.Id;
        }

        public async Task DeleteProductsAsync(int[] productIds)
        {
            var products = new List<Product>();

            foreach (var productId in productIds)
            {
                var product = await GetProductWithAllIncludesAsync(productId);
                if (product is null)
                {
                    throw new NotFoundException($"Product with id: {productId} not found.");
                }
                products.Add(product);
            }

            foreach (var product in products)
            {
                if (product.Images != null)
                {
                    UnitOfWork.FileRepository.RemoveRange(product.Images.Select(a => a.File));

                    foreach (var productImage in product.Images)
                    {
                        _storage.Delete(productImage.File);
                    }
                }
            }

            UnitOfWork.ProductRepository.RemoveRange(products);
            await UnitOfWork.SaveChangesAsync();
        }

        public async Task<IEnumerable<FileDto>> GetProductImagesAsync(int productId)
        {
            var spec = new ProductImagesSpec(productId);

            var productImages =
                await UnitOfWork.ProductImageRepository.GetBySpecAsync(spec);

            return Mapper.Map<IEnumerable<FileDto>>(productImages.Select(a => a.File));
        }

        public async Task CreateProductGroupAsync(ProductGroupDto productGroupDto, int[] productIds = null)
        {
            var productGroup = Mapper.Map<ProductGroup>(productGroupDto);

            if (productIds != null && productIds.Any())
            {
                productGroup.Products = productIds.Distinct()
                    .Select(async id => await UnitOfWork.ProductRepository.FindByIdAsync(id))
                    .Select(a => a.Result).ToList();
            }

            UnitOfWork.ProductGroupRepository.Add(productGroup);
            await UnitOfWork.SaveChangesAsync();
            productGroupDto.Id = productGroup.Id;
        }

        public async Task UpdateProductGroupAsync(ProductGroupDto productGroupDto, int[] productIds = null)
        {
            var productGroupWithProducts = await GetProductGroupWithProductsAsync(productGroupDto.Id);
            if (productGroupWithProducts is null)
            {
                throw new NotFoundException($"Product group with id: {productGroupDto.Id} not found.");
            }

            Mapper.Map(productGroupDto, productGroupWithProducts);

            if (productIds != null && productIds.Any())
            {
                productGroupWithProducts.Products = productIds.Distinct()
                    .Select(async id => await UnitOfWork.ProductRepository.FindByIdAsync(id))
                    .Select(a => a.Result).ToList();
            }

            UnitOfWork.ProductGroupRepository.Update(productGroupWithProducts);
            await UnitOfWork.SaveChangesAsync();
            productGroupDto.Id = productGroupWithProducts.Id;
        }

        public async Task DeleteProductGroupAsync(params int[] productGroupIds)
        {
            UnitOfWork.ProductGroupRepository
                .RemoveRange(productGroupIds.Select(id => new ProductGroup { Id = id }));

            await UnitOfWork.SaveChangesAsync();
        }

        // -----

        // BMP, GIF, JPEG, PNG, TIFF
        private void ThrowIfImageIsNotValid(params Stream[] streams)
        {
            try
            {
                foreach (var stream in streams)
                    System.Drawing.Image.FromStream(stream, false, true);
            }
            catch
            {
                throw new UnsupportedImageException("Unsupported image/s format, allowed formats: BMP, GIF, JPEG, PNG, TIFF");
            }
            finally
            {
                foreach (var stream in streams)
                    stream.Position = 0;
            }
        }

        private IEnumerable<KeyValuePair<ProductImage, Stream>> ImagesFromData(IEnumerable<FileData> imageDatas, int? productId = null)
        {
            var images = new List<KeyValuePair<ProductImage, Stream>>();
            foreach (var imageData in imageDatas)
            {
                var newImage = new ProductImage()
                {
                    ProductId = productId ?? default,
                    File = new Entities.File
                    {
                        FileName = imageData.FileName,
                        ContentType = imageData.ContentType
                    }
                };
                images.Add(new KeyValuePair<ProductImage, Stream>(newImage, imageData.Stream));
            }
            return images;
        }

        private async Task<Product> GetProductWithAllIncludesAsync(int productId)
        {
            var spec = new ProductWithAllIncludesSpec(productId);
            return await UnitOfWork.ProductRepository.FindOneAsync(spec);
        }

        private async Task<ProductGroup> GetProductGroupWithProductsAsync(int groupId)
        {
            var spec = new ProductGroupWithProductsSpec(groupId);
            return await UnitOfWork.ProductGroupRepository.FindOneAsync(spec);
        }
    }
}
