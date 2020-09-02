using Core.Entities;

namespace Core.Specifications.ProductSpecs
{
    public class ProductWithBrandSpec : SpecificationBase<Product>
    {
        public ProductWithBrandSpec(int productId)
        {
            Query.Where(product => product.Id == productId);
            Query.Include(nameof(Product.Brand));
        }
    }
}
