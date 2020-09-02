using System.Collections.Generic;

namespace Core.Entities
{
    public class ProductGroup
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public ICollection<Product> Products { get; set; }
        public ProductGroup() { }
        public ProductGroup(string title)
        {
            Title = title;
        }
    }
}
