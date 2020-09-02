using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface IBrandRepository : IRepository<Brand>
    {
        Task<Brand> FindByIdAsync(int id);
    }
}
