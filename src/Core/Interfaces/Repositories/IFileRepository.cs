using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface IFileRepository : IRepository<File>
    {
        Task<File> FindByIdAsync(string fileId);
    }
}
