using System.Collections.Generic;

namespace Core.Entities
{
    public class Buyer
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string SurName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string UserOrAnonymousId { get; set; }
        public ICollection<Order> Orders { get; set; }
        public Buyer() { }
        public Buyer(string userOrAnonymoysId)
        {
            UserOrAnonymousId = userOrAnonymoysId;
        }
        public Buyer(string userOrAnonymoysId, string firstName, string surName, string lastName, string phoneNumber, string email)
            : this(userOrAnonymoysId)
        {
            FirstName = firstName;
            SurName = surName;
            LastName = lastName;
            PhoneNumber = phoneNumber;
            Email = email;
        }
    }
}
