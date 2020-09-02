using Core.Entities;
using System;
using System.Linq;

namespace Core.Specifications.BrandSpecs
{
    public class BrandsByCatalogIdSpec : SpecificationBase<Brand>
    {
        public BrandsByCatalogIdSpec(params int?[] catalogIds)
        {
            Query.Where(brand => brand.Products.Any(p => catalogIds.Contains(p.CatalogId)));
        }
    }
}
