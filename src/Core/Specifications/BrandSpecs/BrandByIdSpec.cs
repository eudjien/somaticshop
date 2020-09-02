using Core.Entities;

namespace Core.Specifications.BrandSpecs
{
    public class BrandByIdSpec : SpecificationBase<Brand>
    {
        public BrandByIdSpec(int brandId)
        {
            Query.Where(brand => brand.Id == brandId);
        }
    }
}
