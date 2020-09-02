using Core.Entities;

namespace Core.Specifications.Cst
{
    public class CatalogWithProductsSpec : SpecificationBase<Catalog>
    {
        public CatalogWithProductsSpec(int catalogId)
        {
            Query.Where(catalog => catalog.ParentCatalogId == catalogId);
            Query.Include(nameof(Catalog.Products));
        }
    }
}
