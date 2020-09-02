using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfBrandImageRepository : EfRepositoryBase<BrandImage>, IBrandImageRepository
    {
        public EfBrandImageRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfBrandImageRepository(AppDbContext dbContext, ISpecificationEvaluator<BrandImage> specificationEvaluator)
         : base(dbContext, specificationEvaluator)
        {
        }
        public Task<BrandImage> FindByIdAsync(int brandId, string fileId)
        {
            return DbContext.BrandImages.FindAsync(brandId, fileId).AsTask();
        }
    }
}
