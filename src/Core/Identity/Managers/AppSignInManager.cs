using Core.Identity.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Core.Identity.Managers
{
    public class AppSignInManager : SignInManager<User>
    {
        public AppSignInManager(UserManager<User> userManager,
        IHttpContextAccessor httpContextAccessor,
        IUserClaimsPrincipalFactory<User> userClaimsPrincipalFactory,
        IOptions<IdentityOptions> options,
        ILogger<SignInManager<User>> logger,
        IAuthenticationSchemeProvider authenticationSchemeProvider)
            : base(userManager, httpContextAccessor, userClaimsPrincipalFactory, options, logger, authenticationSchemeProvider)
        {
        }

        public AppSignInManager(UserManager<User> userManager,
            IHttpContextAccessor httpContextAccessor,
            IUserClaimsPrincipalFactory<User> userClaimsPrincipalFactory,
            IOptions<IdentityOptions> options,
            ILogger<SignInManager<User>> logger,
            IAuthenticationSchemeProvider authenticationSchemeProvider, IUserConfirmation<User> userConfirmation)
            : base(userManager, httpContextAccessor, userClaimsPrincipalFactory, options, logger, authenticationSchemeProvider)
        {
        }
    }
}
