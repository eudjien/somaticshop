using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface IBasketRepository : IRepository<Basket>
    {
        Task<Basket> FindByIdAsync(int id);
    }
}
