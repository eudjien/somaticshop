using Core.Entities;

namespace Core.Specifications.BrandSpecs
{
    public class BrandProductsSpec : SpecificationBase<Product>
    {
        public BrandProductsSpec(int brandId)
        {
            Query.Where(product => product.BrandId == brandId);
        }
    }
}
