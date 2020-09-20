using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Specifications.SpecSpecs
{
    public class SpecificationWithIncludesByProductId : SpecificationBase<ProductSpecification>
    {
        public SpecificationWithIncludesByProductId(int productId)
        {
            Query.Where(a => a.ProductId == productId);
            Query.Include(a => a.ProductSpecificationName);
            Query.Include(a => a.ProductSpecificationValue);
        }
    }
}
