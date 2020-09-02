using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfOrderRepository : EfRepositoryBase<Order>, IOrderRepository
    {
        public EfOrderRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfOrderRepository(AppDbContext dbContext, ISpecificationEvaluator<Order> specificationEvaluator)
             : base(dbContext, specificationEvaluator)
        {
        }
        public async Task<Order> FindByIdAsync(int id)
        {
            return await DbContext.Orders.FindAsync(id);
        }
    }
}
