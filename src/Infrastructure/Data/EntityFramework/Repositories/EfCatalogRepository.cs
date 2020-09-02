using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfCatalogRepository : EfRepositoryBase<Catalog>, ICatalogRepository
    {
        public EfCatalogRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }

        public EfCatalogRepository(AppDbContext dbContext, ISpecificationEvaluator<Catalog> specificationEvaluator)
            : base(dbContext, specificationEvaluator)
        {
        }

        public async Task<Catalog> FindByIdAsync(int id)
        {
            return await DbContext.Catalogs.FindAsync(id).AsTask();
        }
    }
}
