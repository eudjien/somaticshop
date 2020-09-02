using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfAddressRepository : EfRepositoryBase<Address>, IAddressRepository
    {
        public EfAddressRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfAddressRepository(AppDbContext dbContext, ISpecificationEvaluator<Address> specificationEvaluator)
         : base(dbContext, specificationEvaluator)
        {
        }
        public async Task<Address> FindByIdAsync(int id)
        {
            return await DbContext.Addresses.FindAsync(id).AsTask();
        }
    }
}
