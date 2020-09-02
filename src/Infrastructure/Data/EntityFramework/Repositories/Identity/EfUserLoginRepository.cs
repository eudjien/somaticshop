using Ardalis.Specification;
using Core.Identity.Entities;
using Core.Identity.Repositories;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;

namespace Infrastructure.Data.EntityFramework.Repositories.Identity
{
    public class EfUserLoginRepository : EfRepositoryBase<UserLogin>, IRepository<UserLogin>, IUserLoginRepository
    {
        public EfUserLoginRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfUserLoginRepository(AppDbContext dbContext, ISpecificationEvaluator<UserLogin> specificationEvaluator)
        : base(dbContext, specificationEvaluator)
        {
        }
    }
}
