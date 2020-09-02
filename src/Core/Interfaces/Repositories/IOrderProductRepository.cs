using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface IOrderProductRepository : IRepository<OrderProduct>
    {
        Task<Order> FindByIdAsync(int orderId, int productId);
    }
}
