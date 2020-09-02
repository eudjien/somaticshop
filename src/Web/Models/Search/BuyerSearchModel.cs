using Microsoft.AspNetCore.Mvc;

namespace Web.Models
{
    public class BuyerSearchModel
    {
        [FromQuery(Name = "id")]
        public int?[] Ids { get; set; }
        [FromQuery(Name = "firstname")]
        public string[] FirstNames { get; set; }
        [FromQuery(Name = "lastname")]
        public string[] LastNames { get; set; }
        [FromQuery(Name = "surname")]
        public string[] SurNames { get; set; }
        [FromQuery(Name = "phonenumber")]
        public string[] PhoneNumbers { get; set; }
        [FromQuery(Name = "email")]
        public string[] Emails { get; set; }
        [FromQuery(Name = "UserOrAnonymousId")]
        public string[] UserOrAnonymousIds { get; set; }
    }
}
