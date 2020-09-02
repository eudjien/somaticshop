using Core.Entities;

namespace Core.Specifications.ProductSpecs
{
    public class ProductGroupWithProductsSpec : SpecificationBase<ProductGroup>
    {
        public ProductGroupWithProductsSpec(int groupId)
        {
            Query.Where(productGroup => productGroup.Id == groupId);
            Query.Include($"{nameof(ProductGroup.Products)}");
        }
    }
}
