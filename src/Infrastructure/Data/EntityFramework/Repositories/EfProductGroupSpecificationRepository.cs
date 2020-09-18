using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfProductGroupSpecificationRepository : EfRepositoryBase<ProductGroupSpecification>, IProductGroupSpecificationRepository
    {
        public EfProductGroupSpecificationRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfProductGroupSpecificationRepository(AppDbContext dbContext, ISpecificationEvaluator<ProductGroupSpecification> specificationEvaluator)
          : base(dbContext, specificationEvaluator)
        {
        }
    }
}
