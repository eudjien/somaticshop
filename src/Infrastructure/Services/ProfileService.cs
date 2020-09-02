using Core.Identity;
using Core.Identity.Managers;
using IdentityModel;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class ProfileService : IProfileService
    {

        protected readonly AppUserClaimsPrincipalFactory ClaimsFactory;

        protected readonly ILogger<ProfileService> Logger;

        protected readonly AppUserManager UserManager;

        public ProfileService(AppUserManager userManager,
            AppUserClaimsPrincipalFactory claimsFactory)
        {
            UserManager = userManager;
            ClaimsFactory = claimsFactory;
        }

        public ProfileService(AppUserManager userManager,
            AppUserClaimsPrincipalFactory claimsFactory,
            ILogger<ProfileService> logger)
        {
            UserManager = userManager;
            ClaimsFactory = claimsFactory;
            Logger = logger;
        }

        public virtual async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var sub = context.Subject?.GetSubjectId();
            if (sub == null) throw new Exception("No sub claim present");

            var user = await UserManager.FindByIdAsync(sub);
            if (user == null)
            {
                Logger?.LogWarning("No user found matching subject Id: {0}", sub);
            }
            else
            {
                var principal = await ClaimsFactory.CreateAsync(user);
                if (principal == null) throw new Exception("ClaimsFactory failed to create a principal");

                context.AddRequestedClaims(principal.Claims);
                AddRoleClaims(context, principal);
            }
        }

        public virtual async Task IsActiveAsync(IsActiveContext context)
        {
            var sub = context.Subject?.GetSubjectId();
            if (sub == null) throw new Exception("No subject Id claim present");

            var user = await UserManager.FindByIdAsync(sub);
            if (user == null)
            {
                Logger?.LogWarning("No user found matching subject Id: {0}", sub);
            }

            context.IsActive = user != null;
        }

        private void AddRoleClaims(ProfileDataRequestContext context, ClaimsPrincipal principal)
        {
            var roleClaims = principal.Claims.Where(c => c.Type == JwtClaimTypes.Role);
            if (!roleClaims.IsNullOrEmpty())
            {
                context.IssuedClaims.AddRange(roleClaims);
            }
        }
    }
}