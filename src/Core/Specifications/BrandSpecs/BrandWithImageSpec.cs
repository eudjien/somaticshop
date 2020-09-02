using Core.Entities;

namespace Core.Specifications.BrandSpecs
{
    public class BrandWithImageSpec : SpecificationBase<Brand>
    {
        public BrandWithImageSpec(int brandId)
        {
            Query.Where(brand => brand.Id == brandId);
            Query.Include($"{nameof(Brand.BrandImage)}.{nameof(BrandImage.File)}");
        }
    }
}
