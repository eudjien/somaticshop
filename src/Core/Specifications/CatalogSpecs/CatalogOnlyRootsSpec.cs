using Core.Entities;

namespace Core.Specifications.CatalogSpecs
{
    public class CatalogOnlyRootsSpec : SpecificationBase<Catalog>
    {
        public CatalogOnlyRootsSpec()
        {
            Query.Where(catalog => catalog.ParentCatalogId == null);
        }
    }
}
