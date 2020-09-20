using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface IProductSpecificationValueRepository : IRepository<ProductSpecificationValue>
    {
        Task<ProductSpecificationValue> FindByValueAsync(string value);
    }
}
