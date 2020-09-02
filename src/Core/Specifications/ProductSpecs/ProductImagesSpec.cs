using Core.Entities;

namespace Core.Specifications.ProductSpecs
{
    public class ProductImagesSpec : SpecificationBase<ProductImage>
    {
        public ProductImagesSpec(int productId)
        {
            Query.Where(pi => pi.ProductId == productId);
            Query.Include(nameof(ProductImage.File));
        }
    }
}
