using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfBasketProductRepository : EfRepositoryBase<BasketProduct>, IBasketProductRepository
    {
        public EfBasketProductRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfBasketProductRepository(AppDbContext dbContext, ISpecificationEvaluator<BasketProduct> specificationEvaluator)
         : base(dbContext, specificationEvaluator)
        {
        }
        public async Task<BasketProduct> FindByIdAsync(int basketId, int productId)
        {
            return await DbContext.BasketProducts.FindAsync(basketId, productId).AsTask();
        }
    }
}
