using Ardalis.Specification;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    //interface IInterface<T> : IRepositoryBase<T>
    //{

    //}

    public interface IRepository<T> where T: class
    {
        Task<T> FindByIdAsync(params object[] keyValues);
        Task<T> FindOneAsync(ISpecification<T> specification);
        Task<T> FindFirstAsync(ISpecification<T> specification);

        Task<IEnumerable<T>> ListAsync();
        Task<IEnumerable<T>> ListAsync(ISpecification<T> specification);
        Task<IEnumerable<TResult>> ListAsync<TResult>(ISpecification<T, TResult> specification);

        Task<int> CountAsync();
        Task<int> CountAsync(ISpecification<T> specification);

        void Add(T entity);
        void AddRange(IEnumerable<T> entities);
        void Update(T entity);
        void UpdateRange(IEnumerable<T> entities);
        void Remove(T entity);
        void RemoveRange(IEnumerable<T> entities);
        public Task<int> SaveChangesAsync();
    }
}
