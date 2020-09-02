using Ardalis.Specification;
using Core.Entities;

namespace Core.Specifications.CatalogSpecs
{
    public class CatalogByParentId : Specification<Catalog>
    {
        public CatalogByParentId(int? parentId)
        {
            Query.Where(catalog => catalog.ParentCatalogId == parentId);
        }
    }
}
