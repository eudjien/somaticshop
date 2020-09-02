using AutoMapper;
using Core.Exceptions;
using Core.Identity.Managers;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Core.Services
{
    public class UserService : ServiceBase
    {
        public AppUserManager UserManager { get; private set; }

        public UserService(IUnitOfWork unitOfWork, AppUserManager userManager, IMapper mapper, ILogger<UserService> logger)
            : base(unitOfWork, mapper, logger)
        {
            UserManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
        }

        public async Task UpdateFullName(string userId, string firstName = null, string lastName = null, string surName = null)
        {
            var user = await UserManager.FindByIdAsync(userId);
            if (user is null)
            {
                throw new NotFoundException();
            }
            user.FirstName = firstName;
            user.LastName = lastName;
            user.SurName = surName;
            var result = await UserManager.UpdateAsync(user);
            ThrowIfNotSuccess(result);
        }

        public async Task UpdateEmail(string userId, string newEmail)
        {
            var user = await UserManager.FindByIdAsync(userId);
            var result = await UserManager.SetEmailAsync(user, newEmail);
            ThrowIfNotSuccess(result);
        }

        public async Task UpdatePhoneNumber(string userId, string newPhoneNumber)
        {
            var user = await UserManager.FindByIdAsync(userId);
            var result = await UserManager.SetPhoneNumberAsync(user, newPhoneNumber);
            ThrowIfNotSuccess(result);
        }

        private void ThrowIfNotSuccess(IdentityResult identityResult)
        {
            if (!identityResult.Succeeded)
            {
                throw ExceptionFromIdentityResult(identityResult);
            }
        }

        private Exception ExceptionFromIdentityResult(IdentityResult identityResult)
        {
            var exception = new Exception();
            foreach (var error in identityResult.Errors)
            {
                exception.Data.Add(error.Code, error.Description);
            }
            return exception;
        }
    }
}
