using System.Collections.Generic;

namespace Core.Entities
{
    public class ProductGroup
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Product> Products { get; set; }
        public ICollection<ProductGroupSpecification> Specifications { get; set; }
        public ProductGroup() { }
        public ProductGroup(string name)
        {
            Name = name;
        }
    }
}
