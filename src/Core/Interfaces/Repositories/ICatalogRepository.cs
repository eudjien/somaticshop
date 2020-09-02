using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface ICatalogRepository : IRepository<Catalog>
    {
        Task<Catalog> FindByIdAsync(int id);
    }
}
