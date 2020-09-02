using Core.Entities;

namespace Core.Specifications.CatalogSpecs
{
    public class CatalogChildsSpec : SpecificationBase<Catalog>
    {
        public CatalogChildsSpec(int? catalogId)
        {
            Query.Where(catalog => catalog.ParentCatalogId == catalogId);
        }
    }
}
