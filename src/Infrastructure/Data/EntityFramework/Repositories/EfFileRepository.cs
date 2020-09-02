using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfFileRepository : EfRepositoryBase<File>, IFileRepository
    {
        public EfFileRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfFileRepository(AppDbContext dbContext, ISpecificationEvaluator<File> specificationEvaluator)
         : base(dbContext, specificationEvaluator)
        {
        }
        public Task<File> FindByIdAsync(string fileId)
        {
            return DbContext.Files.FindAsync(fileId).AsTask();
        }
    }
}
