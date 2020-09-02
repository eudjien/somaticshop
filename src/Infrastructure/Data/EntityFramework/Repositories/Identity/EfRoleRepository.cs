using Ardalis.Specification;
using Core.Identity.Entities;
using Core.Identity.Repositories;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;

namespace Infrastructure.Data.EntityFramework.Repositories.Identity
{
    public class EfRoleRepository : EfRepositoryBase<Role>, IRepository<Role>, IRoleRepository
    {
        public EfRoleRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfRoleRepository(AppDbContext dbContext, ISpecificationEvaluator<Role> specificationEvaluator)
         : base(dbContext, specificationEvaluator)
        {
        }
    }
}
