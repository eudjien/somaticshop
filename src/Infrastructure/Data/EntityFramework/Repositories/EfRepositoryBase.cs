using Ardalis.Specification;
using Ardalis.Specification.EntityFrameworkCore;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public abstract class EfRepositoryBase<TEntity> : IRepository<TEntity> where TEntity : class
    {
        protected AppDbContext DbContext { get; private set; }
        private readonly ISpecificationEvaluator<TEntity> specificationEvaluator;

        public EfRepositoryBase(AppDbContext dbContext)
        {
            DbContext = dbContext;
            specificationEvaluator = new SpecificationEvaluator<TEntity>();
        }

        public EfRepositoryBase(AppDbContext dbContext, ISpecificationEvaluator<TEntity> specificationEvaluator)
        {
            DbContext = dbContext;
            this.specificationEvaluator = specificationEvaluator;
        }

        public virtual void Add(TEntity entity)
        {
            DbContext.Add(entity);
        }

        public virtual void AddRange(IEnumerable<TEntity> entities)
        {
            DbContext.AddRange(entities);
        }


        public virtual void Remove(TEntity entity)
        {
            DbContext.Remove(entity);
        }

        public virtual void RemoveRange(IEnumerable<TEntity> entities)
        {
            DbContext.RemoveRange(entities);
        }

        public virtual void Update(TEntity entity)
        {
            DbContext.Update(entity);
        }

        public virtual void UpdateRange(IEnumerable<TEntity> entities)
        {
            DbContext.UpdateRange(entities);
        }

        public Task<TEntity> FindByIdAsync(params object[] keyValues)
        {
            return DbContext.FindAsync<TEntity>(keyValues).AsTask();
        }

        public Task<TEntity> FindOneAsync(ISpecification<TEntity> spec)
        {
            return ApplySpecification(spec).SingleOrDefaultAsync();
        }

        public Task<TEntity> FindFirstAsync(ISpecification<TEntity> spec)
        {
            return ApplySpecification(spec).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await DbContext.Set<TEntity>().AsNoTracking().ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> GetBySpecAsync(ISpecification<TEntity> spec)
        {
            return await ApplySpecification(spec).AsNoTracking().ToListAsync();
        }

        public Task<int> GetAllCountAsync()
        {
            return DbContext.Set<TEntity>().CountAsync();
        }

        public Task<int> GetBySpecCountAsync(ISpecification<TEntity> spec)
        {
            return ApplySpecification(spec).AsNoTracking().CountAsync();
        }

        public Task<int> SaveChangesAsync()
        {
            return DbContext.SaveChangesAsync();
        }

        private IQueryable<TEntity> ApplySpecification(ISpecification<TEntity> specification)
        {
            return specificationEvaluator.GetQuery(DbContext.Set<TEntity>().AsQueryable(), specification);
        }

        private IQueryable<TResult> ApplySpecification<TResult>(ISpecification<TEntity, TResult> specification)
        {
            return specificationEvaluator.GetQuery(DbContext.Set<TEntity>().AsQueryable(), specification);
        }
    }
}
