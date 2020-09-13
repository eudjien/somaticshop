using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entities
{
    public class ProductSpecName
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<ProductSpec> ProductSpecs { get; set; }
    }
}
