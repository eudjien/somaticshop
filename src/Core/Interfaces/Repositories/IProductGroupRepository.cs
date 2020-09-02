using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface IProductGroupRepository : IRepository<ProductGroup>
    {
        Task<ProductGroup> FindByIdAsync(int id);
    }
}
