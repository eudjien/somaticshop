using Microsoft.AspNetCore.Identity;
using System;

namespace Core.Identity.Entities
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string SurName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public User()
        {
        }
        public User(string userName) : base(userName)
        {
        }
    }
}
