using Core.Identity.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.EntityFramework.Context
{
    public class AppIdentityDbContext : IdentityDbContext<User, Role, string, UserClaim, UserRole, UserLogin, RoleClaim, UserToken>
    {
        public AppIdentityDbContext()
        {
        }
        public AppIdentityDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {
        }
    }
}
