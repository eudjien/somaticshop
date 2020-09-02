using System;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface ITransaction : IDisposable, IAsyncDisposable
    {
        void Commit();
        Task CommitAsync();
        void Rollback();
        Task RollbackAsync();
    }
}
