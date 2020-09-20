using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entities
{
    public class ProductSpecificationValue
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public ICollection<ProductSpecification> ProductSpecifications { get; set; }
        public ProductSpecificationValue()
        {
        }
        public ProductSpecificationValue(string value)
        {
            Value = value;
        }
    }
}
