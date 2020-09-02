using Core.Entities;

namespace Core.Specifications.ProductSpecs
{
    public class ProductWithSpecificationsSpec : SpecificationBase<Product>
    {
        public ProductWithSpecificationsSpec(int productId)
        {
            Query.Where(product => product.Id == productId);
            Query.Include(nameof(Product.Specifications));
        }
    }
}
