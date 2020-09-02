using Ardalis.Specification;
using Core.Identity.Entities;
using Core.Identity.Repositories;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;

namespace Infrastructure.Data.EntityFramework.Repositories.Identity
{
    public class EfUserClaimRepository : EfRepositoryBase<UserClaim>, IRepository<UserClaim>, IUserClaimRepository
    {
        public EfUserClaimRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfUserClaimRepository(AppDbContext dbContext, ISpecificationEvaluator<UserClaim> specificationEvaluator)
         : base(dbContext, specificationEvaluator)
        {
        }
    }
}
