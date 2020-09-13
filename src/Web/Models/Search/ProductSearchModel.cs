using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Web.Models
{
    public class ProductSearch
    {
        [FromQuery(Name = "id")]
        public int[] Ids { get; set; }
        [FromQuery(Name = "title")]
        public string[] Titles { get; set; }
        [FromQuery(Name = "priceRange")]
        public PriceRangeModel PriceRange { get; set; }
        [FromQuery(Name = "groupId")]
        public int[] GroupIds { get; set; }
        [FromQuery(Name = "catalogId")]
        public int[] CatalogIds { get; set; }
        [FromQuery(Name = "brandId")]
        public int[] BrandIds { get; set; }
        [FromQuery(Name = "specification")]
        public KeyValuePair<int, string>[] Specifications { get; set; }
    }
}
