using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfProductSpecificationValueRepository : EfRepositoryBase<ProductSpecificationValue>, IProductSpecificationValueRepository
    {
        public EfProductSpecificationValueRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfProductSpecificationValueRepository(AppDbContext dbContext, ISpecificationEvaluator<ProductSpecificationValue> specificationEvaluator)
          : base(dbContext, specificationEvaluator)
        {
        }

        public Task<ProductSpecificationValue> FindByValueAsync(string value)
        {
            return DbContext.Set<ProductSpecificationValue>().SingleOrDefaultAsync(a => a.Value == value);
        }
    }
}
