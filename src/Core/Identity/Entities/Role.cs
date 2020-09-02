using Microsoft.AspNetCore.Identity;

namespace Core.Identity.Entities
{
    public class Role : IdentityRole
    {
        public Role()
        {
        }
        public Role(string roleName) : base(roleName)
        {
        }
    }
}
