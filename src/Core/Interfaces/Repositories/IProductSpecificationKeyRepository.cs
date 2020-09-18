using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface IProductSpecificationKeyRepository : IRepository<ProductSpecificationName>
    {
        Task<ProductSpecificationName> FindByIdAsync(int id);
    }
}
