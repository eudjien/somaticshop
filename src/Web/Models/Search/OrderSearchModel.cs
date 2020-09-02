using Core.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Web.Models
{
    public class OrderSearchModel
    {
        [FromQuery(Name = "id")]
        public int[] Ids { get; set; }
        [FromQuery(Name = "comment")]
        public string[] Comments { get; set; }
        [FromQuery(Name = "status")]
        public DeliveryStatus[] Statuses { get; set; }
        [FromQuery(Name = "buyerId")]
        public int[] BuyerIds { get; set; }
        [FromQuery(Name = "userOrAnonymousId")]
        public string[] UserOrAnonymousIds { get; set; }
        [FromQuery(Name = "addressId")]
        public int[] AddressIds { get; set; }
    }
}
