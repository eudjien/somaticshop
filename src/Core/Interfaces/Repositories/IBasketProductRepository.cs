using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface IBasketProductRepository : IRepository<BasketProduct>
    {
        Task<BasketProduct> FindByIdAsync(int baskedId, int productId);
    }
}
