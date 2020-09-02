using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfCatalogImageRepository : EfRepositoryBase<CatalogImage>, ICatalogImageRepository
    {
        public EfCatalogImageRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfCatalogImageRepository(AppDbContext dbContext, ISpecificationEvaluator<CatalogImage> specificationEvaluator)
            : base(dbContext, specificationEvaluator)
        {
        }
        public Task<CatalogImage> FindByIdAsync(int catalogId, string fileId)
        {
            return DbContext.CatalogImages.FindAsync(catalogId, fileId).AsTask();
        }
    }
}
