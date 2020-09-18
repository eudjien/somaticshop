using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Specifications.ProductSpecs
{
    public class ProductImageThumbnailWithFile : SpecificationBase<ProductImageThumbnail>
    {
        public ProductImageThumbnailWithFile(int productId)
        {
            Query.Where(a => a.ProductId == productId)
                .Include(a => a.File);
        }
    }
}
