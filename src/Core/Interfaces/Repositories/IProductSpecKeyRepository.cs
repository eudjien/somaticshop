using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface IProductSpecKeyRepository : IRepository<ProductSpecName>
    {
        Task<ProductSpecName> FindByIdAsync(int id);
    }
}
