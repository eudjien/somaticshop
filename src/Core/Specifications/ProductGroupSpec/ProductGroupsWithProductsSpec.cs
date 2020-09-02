using Core.Entities;

namespace Core.Specifications.ProductSpecs
{
    public class ProductGroupsWithProductsSpec : SpecificationBase<ProductGroup>
    {
        public ProductGroupsWithProductsSpec(int groupId)
        {
            Query.Where(productGroup => productGroup.Id == groupId);
            Query.Include($"{nameof(ProductGroup.Products)}");
        }
    }
}
