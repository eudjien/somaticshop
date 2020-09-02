using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfProductSpecRepository : EfRepositoryBase<ProductSpec>, IProductSpecRepository
    {
        public EfProductSpecRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfProductSpecRepository(AppDbContext dbContext, ISpecificationEvaluator<ProductSpec> specificationEvaluator)
          : base(dbContext, specificationEvaluator)
        {
        }
        public async Task<ProductSpec> FindByIdAsync(int id)
        {
            return await DbContext.ProductSpecs.FindAsync(id).AsTask();
        }
    }
}
