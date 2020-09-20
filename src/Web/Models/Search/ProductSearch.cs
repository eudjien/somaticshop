using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Web.Models
{
    public class ProductSearch
    {
        [FromQuery(Name = nameof(Product.Id))]
        public int[] Ids { get; set; }
        [FromQuery(Name = nameof(Product.Name))]
        public string[] Names { get; set; }
        [FromQuery(Name = nameof(Product.GroupId))]
        public int[] GroupIds { get; set; }
        [FromQuery(Name = nameof(Product.CatalogId))]
        public int[] CatalogIds { get; set; }
        [FromQuery(Name = nameof(Product.BrandId))]
        public int[] BrandIds { get; set; }
        [FromQuery(Name = "priceRange")]
        public PriceRangeModel PriceRange { get; set; }
        [FromQuery(Name = "specification")]
        public KeyValuePair<int, int>[] Specifications { get; set; }
    }
}
