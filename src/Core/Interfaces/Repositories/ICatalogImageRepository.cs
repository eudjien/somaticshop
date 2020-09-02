using Core.Entities;
using System.Threading.Tasks;

namespace Core.Interfaces.Repositories
{
    public interface ICatalogImageRepository : IRepository<CatalogImage>
    {
        Task<CatalogImage> FindByIdAsync(int catalogId, string fileId);
    }
}
