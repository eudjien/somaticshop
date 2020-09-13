using AutoMapper;
using Core.Common;
using Core.Dto;
using Core.Entities;
using Core.Exceptions;
using Core.Interfaces;
using Core.Specifications.CatalogSpecs;
using Core.Specifications.Cst;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Services
{
    public class CatalogService : ServiceBase
    {

        private readonly IStorage _storage;

        public CatalogService(IUnitOfWork unitOfWork, IStorage storage, IMapper mapper, ILogger<Catalog> logger)
            : base(unitOfWork, mapper, logger)
        {
            _storage = storage;
        }

        public async Task<List<CatalogDto>> GetChildsRecursive(int? catalogId, int? depth = null)
        {

            var list = new List<CatalogDto>();

            var catalogs = Mapper.Map<IEnumerable<CatalogDto>>(await UnitOfWork.CatalogRepository.ListAsync(new CatalogByParentId(catalogId)));

            if (catalogs == null || !catalogs.Any())
            {
                return list;
            }

            list.AddRange(catalogs);

            if (depth.HasValue && depth.Value >= 0)
            {
                depth--;
                if (depth.Value == 0)
                {
                    return list;
                }
            }

            foreach (var catalog in catalogs)
            {
                var childCatalogs = await GetChildsRecursive(catalog.Id, depth);
                if (childCatalogs != null && childCatalogs.Any())
                {
                    list.AddRange(childCatalogs);
                }
            }

            return list;
        }

        public async Task<List<Catalog>> GetParentsRecursive(int parentId)
        {
            var catalog = await UnitOfWork.CatalogRepository.FindByIdAsync(parentId);
            if (catalog is null)
            {
                return null;
            }
            var parents = new List<Catalog>(new[] { catalog });
            if (catalog.ParentCatalogId.HasValue)
            {
                parents.AddRange(await GetParentsRecursive(catalog.ParentCatalogId.Value));
            }
            return parents;
        }

        public async Task CreateCatalogAsync(CatalogDto catalogDto, FileData imageData)
        {
            if (imageData != null)
            {
                ThrowIfImageIsNotValid(imageData.Stream);
            }

            var catalog = Mapper.Map<Catalog>(catalogDto);

            if (imageData != null)
            {
                var newCatalogImage = ImageFromData(imageData);
                catalog.CatalogImage = newCatalogImage;
                _storage.Write(newCatalogImage.File, imageData.Stream);
            }

            UnitOfWork.CatalogRepository.Add(catalog);
            await UnitOfWork.SaveChangesAsync();

            catalogDto.Id = catalog.Id;
        }

        public async Task UpdateCatalogAsync(CatalogDto catalogDto, FileData imageData)
        {
            if (imageData != null)
            {
                ThrowIfImageIsNotValid(imageData.Stream);
            }

            var existCatalog = await GetCatalogWithImageAsync(catalogDto.Id);
            if (existCatalog is null)
            {
                throw new NotFoundException();
            }

            if (existCatalog.CatalogImage != null)
            {
                UnitOfWork.FileRepository.Remove(existCatalog.CatalogImage.File);
                _storage.Delete(existCatalog.CatalogImage.File);
            }

            if (imageData != null)
            {
                var newCatalogImage = ImageFromData(imageData);
                _storage.Write(newCatalogImage.File, imageData.Stream);
                existCatalog.CatalogImage = newCatalogImage;
            }
            else
            {
                existCatalog.CatalogImage = null;
            }

            Mapper.Map(catalogDto, existCatalog);
            UnitOfWork.CatalogRepository.Update(existCatalog);
            await UnitOfWork.SaveChangesAsync();

            catalogDto.Id = existCatalog.Id;
        }

        public async Task DeleteCatalogAsync(int catalogId)
        {
            var catalog = await GetCatalogWithImageAsync(catalogId);
            if (catalog is null)
            {
                throw new NotFoundException();
            }

            if (catalog.CatalogImage != null && catalog.CatalogImage.File != null)
            {
                _storage.Delete(catalog.CatalogImage.File);
                UnitOfWork.FileRepository.Remove(catalog.CatalogImage.File);
            }

            UnitOfWork.CatalogRepository.Remove(catalog);
            await UnitOfWork.SaveChangesAsync();
        }

        public async Task DeleteCatalogsAsync(params int[] catalogIds)
        {
            var catalogList = new List<Catalog>();

            foreach (var catalogId in catalogIds)
            {
                var catalog = await GetCatalogWithImageAsync(catalogId);
                if (catalog is null)
                {
                    throw new NotFoundException($"catalog with id: {catalogId} not found.");
                }
                catalogList.Add(catalog);
            }

            UnitOfWork.CatalogRepository.RemoveRange(catalogList);

            foreach (var catalog in catalogList)
            {
                if (catalog.CatalogImage != null && catalog.CatalogImage.File != null)
                {
                    _storage.Delete(catalog.CatalogImage.File);
                    UnitOfWork.FileRepository.Remove(catalog.CatalogImage.File);
                }
            }

            await UnitOfWork.SaveChangesAsync();
        }

        public async Task<CatalogImageDto> GetCatalogImageAsync(int catalogId)
        {
            var catalog = await GetCatalogWithImageAsync(catalogId);
            return Mapper.Map<CatalogImageDto>(catalog.CatalogImage);
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

        private CatalogImage ImageFromData(FileData fileData, int? catalogId = null)
        {
            var newImage = new CatalogImage()
            {
                CatalogId = catalogId ?? default,
                File = new Entities.File
                {
                    FileName = fileData.FileName,
                    ContentType = fileData.ContentType
                }
            };
            return newImage;
        }

        private async Task<Catalog> GetCatalogWithImageAsync(int catalogId)
        {
            var spec = new CatalogWithImageSpec(catalogId);
            var catalog = await UnitOfWork.CatalogRepository.FindOneAsync(spec);
            return catalog;
        }
    }
}
