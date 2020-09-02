using Core.Identity.Entities;
using Core.Identity.Managers;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Core.Identity
{
    public class AppUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<User, Role>
    {
        public AppUserClaimsPrincipalFactory(AppUserManager userManager, AppRoleManager roleManager, IOptions<IdentityOptions> options)
            : base(userManager, roleManager, options)
        {
        }
    }
}
