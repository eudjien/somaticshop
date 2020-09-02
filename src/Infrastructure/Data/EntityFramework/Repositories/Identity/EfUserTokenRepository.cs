using Ardalis.Specification;
using Core.Identity.Entities;
using Core.Identity.Repositories;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;

namespace Infrastructure.Data.EntityFramework.Repositories.Identity
{
    public class EfUserTokenRepository : EfRepositoryBase<UserToken>, IRepository<UserToken>, IUserTokenRepository
    {
        public EfUserTokenRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfUserTokenRepository(AppDbContext dbContext, ISpecificationEvaluator<UserToken> specificationEvaluator)
        : base(dbContext, specificationEvaluator)
        {
        }
    }
}
