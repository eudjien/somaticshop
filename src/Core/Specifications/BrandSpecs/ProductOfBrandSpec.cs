using Core.Entities;

namespace Core.Specifications.BrandSpecs
{
    public class ProductOfBrandSpec : SpecificationBase<Product>
    {
        public ProductOfBrandSpec(int brandId, int productId)
        {
            Query.Where(product => product.Id == productId && product.BrandId == brandId);
        }
    }
}
