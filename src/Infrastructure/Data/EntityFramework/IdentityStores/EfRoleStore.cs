using Core.Identity.Entities;
using Infrastructure.Data.EntityFramework.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Infrastructure.Data.EntityFramework.IdentityStores
{
    public class EfRoleStore : RoleStore<Role, AppDbContext, string, UserRole, RoleClaim>
    {
        public EfRoleStore(AppDbContext dbContext, IdentityErrorDescriber entityErrorDescriptor = null)
            : base(dbContext, entityErrorDescriptor)
        {
            AutoSaveChanges = true;
        }
    }
}
