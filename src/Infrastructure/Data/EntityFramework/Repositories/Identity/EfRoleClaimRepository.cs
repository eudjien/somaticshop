using Ardalis.Specification;
using Core.Identity.Entities;
using Core.Identity.Repositories;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;

namespace Infrastructure.Data.EntityFramework.Repositories.Identity
{
    public class EfRoleClaimRepository : EfRepositoryBase<RoleClaim>, IRepository<RoleClaim>, IRoleClaimRepository
    {
        public EfRoleClaimRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfRoleClaimRepository(AppDbContext dbContext, ISpecificationEvaluator<RoleClaim> specificationEvaluator)
            : base(dbContext, specificationEvaluator)
        {
        }
    }
}
