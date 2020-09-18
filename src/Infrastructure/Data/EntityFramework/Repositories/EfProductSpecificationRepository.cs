using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfProductSpecificationRepository : EfRepositoryBase<ProductSpecification>, IProductSpecificationRepository
    {
        public EfProductSpecificationRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfProductSpecificationRepository(AppDbContext dbContext, ISpecificationEvaluator<ProductSpecification> specificationEvaluator)
          : base(dbContext, specificationEvaluator)
        {
        }
    }
}
