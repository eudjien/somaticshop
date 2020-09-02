using AutoMapper;
using Core.Common;
using Core.Dto;
using Core.Entities;
using Core.Exceptions;
using Core.Interfaces;
using Core.Specifications.BrandSpecs;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Core.Services
{
    public class BrandService : ServiceBase
    {

        private readonly IStorage _storage;

        public BrandService(IUnitOfWork unitOfWork, IStorage storage, IMapper mapper, ILogger<BrandService> logger)
            : base(unitOfWork, mapper, logger)
        {
            _storage = storage;
        }

        public async Task CreateBrandAsync(BrandDto brandDto, FileData imageData)
        {
            if (imageData != null)
            {
                ThrowIfImageIsNotValid(imageData.Stream);
            }

            var brand = Mapper.Map<Brand>(brandDto);

            if (imageData != null)
            {
                var newBrandImage = ImageFromData(imageData);
                brand.BrandImage = newBrandImage;
                _storage.Write(newBrandImage.File, imageData.Stream);
            }

            UnitOfWork.BrandRepository.Add(brand);

            await UnitOfWork.SaveChangesAsync();

            brandDto.Id = brand.Id;
        }

        public async Task UpdateBrandAsync(BrandDto brandDto, FileData imageData)
        {
            if (imageData != null)
            {
                ThrowIfImageIsNotValid(imageData.Stream);
            }

            var existBrand = await GetBrandWithImageAsync(brandDto.Id);
            if (existBrand is null)
            {
                throw new NotFoundException();
            }

            if (existBrand.BrandImage != null)
            {
                UnitOfWork.FileRepository.Remove(existBrand.BrandImage.File);
                _storage.Delete(existBrand.BrandImage.File);
            }

            if (imageData != null)
            {
                var newBrandImage = ImageFromData(imageData);
                _storage.Write(newBrandImage.File, imageData.Stream);
                existBrand.BrandImage = newBrandImage;
            }
            else
            {
                existBrand.BrandImage = null;
            }

            Mapper.Map(brandDto, existBrand);
            UnitOfWork.BrandRepository.Update(existBrand);
            await UnitOfWork.SaveChangesAsync();

            brandDto.Id = existBrand.Id;
        }

        public async Task DeleteBrandAsync(int brandId)
        {
            var brand = await GetBrandWithImageAsync(brandId);
            if (brand is null)
            {
                throw new NotFoundException();
            }

            if (brand.BrandImage != null && brand.BrandImage.File != null)
            {
                _storage.Delete(brand.BrandImage.File);
                UnitOfWork.FileRepository.Remove(brand.BrandImage.File);
            }

            UnitOfWork.BrandRepository.Remove(brand);
            await UnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteBrandsAsync(params int[] brandIds)
        {
            var brandList = new List<Brand>();

            foreach (var brandId in brandIds)
            {
                var brand = await GetBrandWithImageAsync(brandId);
                if (brand is null)
                {
                    throw new NotFoundException($"Brand with id: {brandId} not found");
                }
                brandList.Add(brand);
            }

            UnitOfWork.BrandRepository.RemoveRange(brandList);

            foreach (var brand in brandList)
            {
                if (brand.BrandImage != null && brand.BrandImage.File != null)
                {
                    _storage.Delete(brand.BrandImage.File);
                    UnitOfWork.FileRepository.Remove(brand.BrandImage.File);
                }
            }

            await UnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteImageAsync(int brandId)
        {
            var brand = await GetBrandWithImageAsync(brandId);

            if (brand.BrandImage != null && brand.BrandImage.File != null)
            {
                _storage.Delete(brand.BrandImage.File);
                UnitOfWork.FileRepository.Remove(brand.BrandImage.File);
                await UnitOfWork.SaveChangesAsync();
            }
        }

        public async Task PutImageAsync(int brandId, FileData fileData)
        {
            ThrowIfImageIsNotValid(fileData.Stream);
            var brand = await GetBrandWithImageAsync(brandId);

            if (brand.BrandImage != null)
            {
                brand.BrandImage.File.FileName = fileData.FileName;
                brand.BrandImage.File.ContentType = fileData.ContentType;
                UnitOfWork.FileRepository.Update(brand.BrandImage.File);
                _storage.Delete(brand.BrandImage.File);
                _storage.Write(brand.BrandImage.File, fileData.Stream);
            }
            else
            {
                var image = ImageFromData(fileData);
                UnitOfWork.BrandImageRepository.Add(image);
                _storage.Write(image.File, fileData.Stream);
            }
            await UnitOfWork.SaveChangesAsync();
        }

        public async Task<BrandImageDto> GetBrandImageAsync(int brandId)
        {
            var brand = await GetBrandWithImageAsync(brandId);
            return Mapper.Map<BrandImageDto>(brand.BrandImage);
        }

        // BMP, GIF, JPEG, PNG, TIFF
        private void ThrowIfImageIsNotValid(Stream stream)
        {
            try
            {
                System.Drawing.Image.FromStream(stream, false, true);
            }
            catch
            {
                throw new UnsupportedImageException("Unsupported image/s format, allowed formats: BMP, GIF, JPEG, PNG, TIFF");
            }
            finally
            {
                stream.Position = 0;
            }
        }

        private BrandImage ImageFromData(FileData fileData)
        {
            var newImage = new BrandImage()
            {
                File = new Entities.File
                {
                    FileName = fileData.FileName,
                    ContentType = fileData.ContentType
                }
            };
            return newImage;
        }

        private async Task<Brand> GetBrandWithImageAsync(int brandId)
        {
            var brand = await UnitOfWork.BrandRepository.FindOneAsync(
                new BrandWithImageSpec(brandId));
            return brand;
        }
    }
}
