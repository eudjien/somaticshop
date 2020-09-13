using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfProductSpecKeyRepository : EfRepositoryBase<ProductSpecName>, IProductSpecKeyRepository
    {
        public EfProductSpecKeyRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfProductSpecKeyRepository(AppDbContext dbContext, ISpecificationEvaluator<ProductSpecName> specificationEvaluator)
          : base(dbContext, specificationEvaluator)
        {
        }
        public async Task<ProductSpecName> FindByIdAsync(int id)
        {
            return await DbContext.ProductSpecKeys.FindAsync(id).AsTask();
        }
    }
}
