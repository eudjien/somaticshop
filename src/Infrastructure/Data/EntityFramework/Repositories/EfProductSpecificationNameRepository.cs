using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfProductSpecificationNameRepository : EfRepositoryBase<ProductSpecificationName>, IProductSpecificationNameRepository
    {
        public EfProductSpecificationNameRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfProductSpecificationNameRepository(AppDbContext dbContext, ISpecificationEvaluator<ProductSpecificationName> specificationEvaluator)
          : base(dbContext, specificationEvaluator)
        {
        }
        public Task<ProductSpecificationName> FindByNameAsync(string name)
        {
            return DbContext.Set<ProductSpecificationName>().SingleOrDefaultAsync(a => a.Name == name);
        }
    }
}
