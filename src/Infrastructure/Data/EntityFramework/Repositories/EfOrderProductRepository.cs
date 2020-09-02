using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfOrderProductRepository : EfRepositoryBase<OrderProduct>, IOrderProductRepository
    {
        public EfOrderProductRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfOrderProductRepository(AppDbContext dbContext, ISpecificationEvaluator<OrderProduct> specificationEvaluator)
           : base(dbContext, specificationEvaluator)
        {
        }
        public async Task<Order> FindByIdAsync(int orderId, int productId)
        {
            return await DbContext.Orders.FindAsync(orderId, productId);
        }
    }
}
