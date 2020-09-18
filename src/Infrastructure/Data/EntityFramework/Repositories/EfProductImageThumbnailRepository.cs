using Ardalis.Specification;
using Core.Entities;
using Core.Interfaces.Repositories;
using Infrastructure.Data.EntityFramework.Context;
using System.Threading.Tasks;

namespace Infrastructure.Data.EntityFramework.Repositories
{
    public class EfProductImageThumbnailRepository : EfRepositoryBase<ProductImageThumbnail>, IProductImageThumbnailRepository
    {
        public EfProductImageThumbnailRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }
        public EfProductImageThumbnailRepository(AppDbContext dbContext, ISpecificationEvaluator<ProductImageThumbnail> specificationEvaluator)
          : base(dbContext, specificationEvaluator)
        {
        }
    }
}
