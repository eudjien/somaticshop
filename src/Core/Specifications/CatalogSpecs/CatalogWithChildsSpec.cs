using Core.Entities;

namespace Core.Specifications.Cst
{
    public class CatalogWithChildsSpec : SpecificationBase<Catalog>
    {
        public CatalogWithChildsSpec(int catalogId)
        {
            Query.Where(catalog => catalog.Id == catalogId);
            Query.Include(nameof(Catalog.ChildCatalogs));
        }
    }
}
