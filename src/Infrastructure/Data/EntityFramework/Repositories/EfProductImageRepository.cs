using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfProductImageRepository : EfRepositoryBase<ProductImage>, IProductImageRepository
    {
        public EfProductImageRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfProductImageRepository(AppDbContext dbContext, ISpecificationEvaluator<ProductImage> specificationEvaluator)
          : base(dbContext, specificationEvaluator)
        {
        }
        public Task<ProductImage> FindByIdAsync(int productId, string fileId)
        {
            return DbContext.ProductImages.FindAsync(productId, fileId).AsTask();
        }
    }
}
