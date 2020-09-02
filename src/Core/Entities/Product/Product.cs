using System;
using System.Collections.Generic;

namespace Core.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public DateTimeOffset Date { get; set; }
        public int? CatalogId { get; set; }
        public int? BrandId { get; set; }
        public int? GroupId { get; set; }
        public Catalog Catalog { get; set; }
        public Brand Brand { get; set; }
        public ProductGroup Group { get; set; }
        public ICollection<ProductSpec> Specifications { get; set; }
        public ICollection<ProductImage> Images { get; set; }
        public Product() { }
        public Product(string title, string content, string description, decimal price, DateTimeOffset date, int? catalogId, int? brandId, int? groupId)
        {
            Title = title;
            Content = content;
            Description = description;
            Price = price;
            Date = date;
            CatalogId = catalogId;
            BrandId = brandId;
            GroupId = groupId;
        }
    }
}
