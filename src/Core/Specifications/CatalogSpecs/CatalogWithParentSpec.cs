using Core.Entities;

namespace Core.Specifications.CatalogSpecs
{
    public class CatalogWithParentSpec : SpecificationBase<Catalog>
    {
        public CatalogWithParentSpec(int catalogId)
        {
            Query.Where(catalog => catalog.Id == catalogId);
            Query.Include(nameof(Catalog.ParentCatalog));
        }
    }
}
