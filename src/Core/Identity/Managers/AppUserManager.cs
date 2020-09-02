using Core.Identity.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Identity.Managers
{
    public class AppUserManager : UserManager<User>
    {
        public AppUserManager(
            IUserStore<User> store,
            IOptions<IdentityOptions> optionsAccessor,
            IPasswordHasher<User> passwordHasher,
            IEnumerable<IUserValidator<User>> userValidators,
            IEnumerable<IPasswordValidator<User>> passwordValidators,
            ILookupNormalizer keyNormalizer,
            IdentityErrorDescriber errors,
            IServiceProvider services,
            ILogger<UserManager<User>> logger) :
        base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        {
        }

        public async Task<IEnumerable<User>> GetUsersNotInRoleAsync(IEnumerable<User> users, string role)
        {
            var usersNotInRole = new List<User>();
            foreach (var user in users)
            {
                if (!await IsInRoleAsync(user, role))
                {
                    usersNotInRole.Add(user);
                }
            }
            return usersNotInRole;
        }
    }
}
