using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entities
{
    public class ProductSpecificationName
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<ProductSpecification> ProductSpecifications { get; set; }
    }
}
