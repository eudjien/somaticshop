using Core.Entities;

namespace Core.Specifications.ProductSpecs
{
    public class ProductImageSpec : SpecificationBase<ProductImage>
    {
        public ProductImageSpec(int productId, string fileId)
        {
            Query.Where(pi => pi.ProductId == productId && pi.FileId == fileId);
        }
    }
}
