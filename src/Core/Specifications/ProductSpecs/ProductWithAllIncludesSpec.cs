using Core.Entities;

namespace Core.Specifications.ProductSpecs
{
    public class ProductWithAllIncludesSpec : SpecificationBase<Product>
    {
        public ProductWithAllIncludesSpec(int productId)
        {
            Query.Where(product => product.Id == productId);
            Query.Include($"{nameof(Product.Images)}.{nameof(ProductImage.File)}")
                .Include($"{nameof(Product.Specifications)}")
                .Include($"{nameof(Product.Group)}")
                .Include($"{nameof(Product.Catalog)}")
                .Include($"{nameof(Product.Brand)}");
        }
    }
}
