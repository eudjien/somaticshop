using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfBuyerRepository : EfRepositoryBase<Buyer>, IBuyerRepository
    {
        public EfBuyerRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfBuyerRepository(AppDbContext dbContext, ISpecificationEvaluator<Buyer> specificationEvaluator)
            : base(dbContext, specificationEvaluator)
        {
        }
        public async Task<Buyer> FindByIdAsync(int id)
        {
            return await DbContext.Buyers.FindAsync(id).AsTask();
        }
    }
}
