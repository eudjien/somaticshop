using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface IAddressRepository : IRepository<Address>
    {
        Task<Address> FindByIdAsync(int id);
    }
}
