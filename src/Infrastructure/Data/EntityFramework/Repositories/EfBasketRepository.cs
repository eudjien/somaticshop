using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfBasketRepository : EfRepositoryBase<Basket>, IBasketRepository
    {
        public EfBasketRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfBasketRepository(AppDbContext dbContext, ISpecificationEvaluator<Basket> specificationEvaluator)
         : base(dbContext, specificationEvaluator)
        {
        }
        public async Task<Basket> FindByIdAsync(int id)
        {
            return await DbContext.Baskets.FindAsync(id).AsTask();
        }
    }
}
