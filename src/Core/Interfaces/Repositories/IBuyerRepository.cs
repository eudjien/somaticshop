using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface IBuyerRepository : IRepository<Buyer>
    {
        Task<Buyer> FindByIdAsync(int id);
    }
}
