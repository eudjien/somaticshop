using Core.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework
{
    public class EfTransactionAdapter : ITransaction, IDisposable, IAsyncDisposable
    {

        private readonly IDbContextTransaction _dbContextTransaction;

        public EfTransactionAdapter(IDbContextTransaction dbContextTransaction)
        {
            _dbContextTransaction = dbContextTransaction;
        }

        public void Commit()
        {
            _dbContextTransaction.Commit();
        }

        public Task CommitAsync()
        {
            return _dbContextTransaction.CommitAsync();
        }

        public void Rollback()
        {
            _dbContextTransaction.Rollback();
        }

        public Task RollbackAsync()
        {
            return _dbContextTransaction.RollbackAsync();
        }

        public void Dispose()
        {
            _dbContextTransaction.Dispose();
        }

        public ValueTask DisposeAsync()
        {
            return _dbContextTransaction.DisposeAsync();
        }
    }
}
