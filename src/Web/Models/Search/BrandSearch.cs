using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Web.Models
{
    public class BrandSearch
    {
        [FromQuery(Name = nameof(Brand.Id))]
        public int[] Ids { get; set; }
        [FromQuery(Name = nameof(Brand.Name))]
        public string[] Names { get; set; }
    }
}
