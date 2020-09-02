using Core.Entities;

namespace Core.Specifications.ProductSpecs
{
    public class ProductWithImagesSpec : SpecificationBase<Product>
    {
        public ProductWithImagesSpec(int productId)
        {
            Query.Where(product => product.Id == productId);
            Query.Include($"{nameof(Product.Images)}.{nameof(ProductImage.File)}");
        }
    }
}
