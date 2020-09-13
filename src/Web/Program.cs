using Core.Identity.Managers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using Azure.Identity;
using Microsoft.Extensions.Configuration;
using System;

namespace Web
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            {
                var rm = scope.ServiceProvider.GetRequiredService<AppRoleManager>();
                var um = scope.ServiceProvider.GetRequiredService<AppUserManager>();

                //var u = await um.FindByNameAsync("VasyaPupkin");
                //await rm.CreateAsync(new Role("God"));
                //await um.AddToRoleAsync(u, "God");
            }
            //{
            //    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();
            //    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

            //    var user = await userManager.FindByNameAsync("VasyaPupkin");
            //    await userManager.AddToRoleAsync(user, "Admin");


            //    //var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            //    //await dbContext.Database.EnsureDeletedAsync();

            //    //if (await dbContext.Database.EnsureCreatedAsync())
            //    //{
            //    //await DbSeed.CreateRoles(scope.ServiceProvider);
            //    //await DbSeed.UsersAsync(scope.ServiceProvider);
            //    //await DbSeed.BrandsAsync(scope.ServiceProvider);
            //    //await DbSeed.CatalogsAsync(scope.ServiceProvider);
            //    //await DbSeed.ProductGroupsAsync(scope.ServiceProvider);
            //    //await DbSeed.ProductsAsync(scope.ServiceProvider);
            //    //await DbSeed.OrdersAsync(scope.ServiceProvider);
            //    //}

            //}

            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, config) => {
                    //var keyVaultEndpoint = new Uri(Environment.GetEnvironmentVariable("VaultUri"));
                    //config.AddAzureKeyVault(keyVaultEndpoint, new DefaultAzureCredential());
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    //webBuilder.UseUrls("http://192.168.0.100:5000", "https://192.168.0.100:5001");
                    webBuilder.UseStartup<Startup>();
                });
    }
}
