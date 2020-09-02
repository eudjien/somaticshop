using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfBrandRepository : EfRepositoryBase<Brand>, IBrandRepository
    {
        public EfBrandRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfBrandRepository(AppDbContext dbContext, ISpecificationEvaluator<Brand> specificationEvaluator)
         : base(dbContext, specificationEvaluator)
        {
        }
        public async Task<Brand> FindByIdAsync(int id)
        {
            return await DbContext.Brands.FindAsync(id).AsTask();
        }
    }
}
