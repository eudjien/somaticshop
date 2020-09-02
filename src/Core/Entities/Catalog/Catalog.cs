using System.Collections.Generic;

namespace Core.Entities
{
    public class Catalog
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int? ParentCatalogId { get; set; }
        public Catalog ParentCatalog { get; set; }
        public CatalogImage CatalogImage { get; set; }
        public ICollection<Product> Products { get; set; }
        public ICollection<Catalog> ChildCatalogs { get; set; }
        public Catalog() { }
        public Catalog(string title, int? parentCatalogId)
        {
            Title = title;
            ParentCatalogId = parentCatalogId;
        }
    }
}
