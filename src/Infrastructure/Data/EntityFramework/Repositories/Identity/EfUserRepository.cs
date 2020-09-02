using Ardalis.Specification;
using Core.Identity.Entities;
using Core.Identity.Repositories;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;

namespace Infrastructure.Data.EntityFramework.Repositories.Identity
{
    public class EfUserRepository : EfRepositoryBase<User>, IRepository<User>, IUserRepository
    {
        public EfUserRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfUserRepository(AppDbContext dbContext, ISpecificationEvaluator<User> specificationEvaluator)
        : base(dbContext, specificationEvaluator)
        {
        }
    }
}
