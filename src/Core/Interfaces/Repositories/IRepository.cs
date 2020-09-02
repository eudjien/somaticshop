using Ardalis.Specification;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface IRepository<TEntity>
    {
        Task<TEntity> FindByIdAsync(params object[] keyValues);
        Task<TEntity> FindOneAsync(ISpecification<TEntity> spec);
        Task<TEntity> FindFirstAsync(ISpecification<TEntity> spec);
        Task<IEnumerable<TEntity>> GetAllAsync();
        Task<IEnumerable<TEntity>> GetBySpecAsync(ISpecification<TEntity> spec);
        Task<int> GetAllCountAsync();
        Task<int> GetBySpecCountAsync(ISpecification<TEntity> spec);

        void Add(TEntity entity);
        void AddRange(IEnumerable<TEntity> entities);
        void Update(TEntity entity);
        void UpdateRange(IEnumerable<TEntity> entities);
        void Remove(TEntity entity);
        void RemoveRange(IEnumerable<TEntity> entities);
        public Task<int> SaveChangesAsync();
    }
}
