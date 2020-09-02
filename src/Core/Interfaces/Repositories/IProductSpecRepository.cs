using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface IProductSpecRepository : IRepository<ProductSpec>
    {
        Task<ProductSpec> FindByIdAsync(int id);
    }
}
