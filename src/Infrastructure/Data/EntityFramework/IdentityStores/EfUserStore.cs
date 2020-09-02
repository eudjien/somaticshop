using Core.Identity.Entities;
using Infrastructure.Data.EntityFramework.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Infrastructure.Data.EntityFramework.IdentityStores
{
    public class EfUserStore : UserStore<User, Role, AppDbContext, string, UserClaim, UserRole, UserLogin, UserToken, RoleClaim>
    {
        public EfUserStore(AppDbContext dbContext, IdentityErrorDescriber entityErrorDescriptor = null)
            : base(dbContext, entityErrorDescriptor)
        {
            AutoSaveChanges = true;
        }
    }
}
