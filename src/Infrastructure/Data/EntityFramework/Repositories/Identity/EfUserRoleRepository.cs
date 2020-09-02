using Ardalis.Specification;
using Core.Identity.Entities;
using Core.Identity.Repositories;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;

namespace Infrastructure.Data.EntityFramework.Repositories.Identity
{
    public class EfUserRoleRepository : EfRepositoryBase<UserRole>, IRepository<UserRole>, IUserRoleRepository
    {
        public EfUserRoleRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfUserRoleRepository(AppDbContext dbContext, ISpecificationEvaluator<UserRole> specificationEvaluator)
        : base(dbContext, specificationEvaluator)
        {
        }
    }
}
