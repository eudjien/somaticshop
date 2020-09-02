using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfProductRepository : EfRepositoryBase<Product>, IProductRepository
    {
        public EfProductRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfProductRepository(AppDbContext dbContext, ISpecificationEvaluator<Product> specificationEvaluator)
          : base(dbContext, specificationEvaluator)
        {
        }
        public async Task<Product> FindByIdAsync(int id)
        {
            return await DbContext.Products.FindAsync(id).AsTask();
        }
    }
}
