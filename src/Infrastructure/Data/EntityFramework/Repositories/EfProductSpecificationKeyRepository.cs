using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfProductSpecificationKeyRepository : EfRepositoryBase<ProductSpecificationName>, IProductSpecificationKeyRepository
    {
        public EfProductSpecificationKeyRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfProductSpecificationKeyRepository(AppDbContext dbContext, ISpecificationEvaluator<ProductSpecificationName> specificationEvaluator)
          : base(dbContext, specificationEvaluator)
        {
        }
        public async Task<ProductSpecificationName> FindByIdAsync(int id)
        {
            return await DbContext.ProductSpecificationKeys.FindAsync(id).AsTask();
        }
    }
}
