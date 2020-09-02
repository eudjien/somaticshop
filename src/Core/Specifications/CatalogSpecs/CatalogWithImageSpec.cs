using Core.Entities;

namespace Core.Specifications.Cst
{
    public class CatalogWithImageSpec : SpecificationBase<Catalog>
    {
        public CatalogWithImageSpec(int catalogId)
        {
            Query.Where(catalog => catalog.Id == catalogId);
            Query.Include($"{nameof(Catalog.CatalogImage)}.{nameof(CatalogImage.File)}");
        }
    }
}
