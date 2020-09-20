using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface IProductSpecificationNameRepository : IRepository<ProductSpecificationName>
    {
        Task<ProductSpecificationName> FindByNameAsync(string name);
    }
}
