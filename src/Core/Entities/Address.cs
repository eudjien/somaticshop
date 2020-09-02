using System.Collections.Generic;

namespace Core.Entities
{
    public class Address
    {
        public int Id { get; set; }
        public string Country { get; set; }
        public string AddressText { get; set; }
        public string PostalCode { get; set; }
        public ICollection<Order> Orders { get; set; }
        public Address() { }
        public Address(string country, string addressText, string postalCode)
        {
            Country = country;
            AddressText = addressText;
            PostalCode = postalCode;
        }
    }
}
