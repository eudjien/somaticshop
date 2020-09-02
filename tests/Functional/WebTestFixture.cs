using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Web;

namespace Microsoft.eShopWeb.FunctionalTests.Web
{
    public class WebTestFixture : WebApplicationFactory<Startup>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            base.ConfigureWebHost(builder);
            //builder.UseEnvironment("Testing");

            //builder.ConfigureServices(services =>
            //{
            //     services.AddEntityFrameworkInMemoryDatabase();

            //    var provider = services
            //        .AddEntityFrameworkInMemoryDatabase()
            //        .BuildServiceProvider();

            //    services.AddDbContext<AppDbContext>(options =>
            //    {
            //        options.UseInMemoryDatabase("InMemoryDbForTesting");
            //        options.UseInternalServiceProvider(provider);
            //    });

            //    var sp = services.BuildServiceProvider();

            //    using (var scope = sp.CreateScope())
            //    {
            //        var scopedServices = scope.ServiceProvider;
            //        var db = scopedServices.GetRequiredService<AppDbContext>();
            //        var loggerFactory = scopedServices.GetRequiredService<ILoggerFactory>();

            //        var logger = scopedServices
            //            .GetRequiredService<ILogger<WebTestFixture>>();

            //        db.Database.EnsureCreated();

            //        try
            //        {
            //            CatalogSeed.SeedAsync(db).Wait();

            //            // seed sample user data
            //            var userManager = scopedServices.GetRequiredService<UserManager<User>>();
            //            var roleManager = scopedServices.GetRequiredService<RoleManager<Role>>();
            //            AppIdentityDbContextSeed.SeedAsync(userManager, roleManager).Wait();
            //        }
            //        catch (Exception ex)
            //        {
            //            logger.LogError(ex, $"An error occurred seeding the " +
            //                "database with test messages. Error: {ex.Message}");
            //        }
            //    }
            //});
        }
    }
}
