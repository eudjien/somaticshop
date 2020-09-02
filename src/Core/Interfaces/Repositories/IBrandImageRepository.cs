using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface IBrandImageRepository : IRepository<BrandImage>
    {
        Task<BrandImage> FindByIdAsync(int brandId, string fileId);
    }
}
