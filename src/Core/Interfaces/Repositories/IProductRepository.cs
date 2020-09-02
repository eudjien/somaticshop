using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<Product> FindByIdAsync(int id);
    }
}
