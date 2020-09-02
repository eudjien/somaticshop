using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfProductGroupRepository : EfRepositoryBase<ProductGroup>, IProductGroupRepository
    {
        public EfProductGroupRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfProductGroupRepository(AppDbContext dbContext, ISpecificationEvaluator<ProductGroup> specificationEvaluator)
            : base(dbContext, specificationEvaluator)
        {
        }
        public async Task<ProductGroup> FindByIdAsync(int id)
        {
            return await DbContext.ProductGroups.FindAsync(id).AsTask();
        }
    }
}
