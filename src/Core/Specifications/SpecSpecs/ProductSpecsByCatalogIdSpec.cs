using Core.Entities;
using System;
using System.Linq;

namespace Core.Specifications.BrandSpecs
{
    public class ProductSpecsByCatalogIdSpec : SpecificationBase<ProductSpecification>
    {
        public ProductSpecsByCatalogIdSpec(int catalogId)
        {
            Query.Where(s => s.Product.CatalogId == catalogId);
        }
        public ProductSpecsByCatalogIdSpec(params int[] catalogIds)
        {
            Query.Where(s => catalogIds.Contains(s.Product.CatalogId.GetValueOrDefault()));
        }
    }
}
