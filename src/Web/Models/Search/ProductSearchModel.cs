using Microsoft.AspNetCore.Mvc;

namespace Web.Models
{
    public class ProductSearchModel
    {
        [FromQuery(Name = "id")]
        public int[] Ids { get; set; }
        [FromQuery(Name = "title")]
        public string[] Titles { get; set; }
        [FromQuery(Name = "price")]
        public PriceRangeModel PriceRange { get; set; }
        [FromQuery(Name = "groupId")]
        public int[] GroupIds { get; set; }
        [FromQuery(Name = "catalogId")]
        public int[] CatalogIds { get; set; }
        [FromQuery(Name = "brandId")]
        public int[] BrandIds { get; set; }
    }
}
