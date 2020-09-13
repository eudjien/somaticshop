using System.Collections.Generic;

namespace Core.Entities
{
    public class Brand
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Content { get; set; }
        public BrandImage BrandImage { get; set; }
        public ICollection<Product> Products { get; set; }
        public Brand() { }
        public Brand(string name, string content)
        {
            Name = name;
            Content = content;
        }
    }
}
