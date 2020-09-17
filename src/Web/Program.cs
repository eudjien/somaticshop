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
            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) => Host.CreateDefaultBuilder(args)
            //.ConfigureAppConfiguration((context, config) =>
            //{
            //    var keyVaultEndpoint = new Uri(Environment.GetEnvironmentVariable("VaultUri"));
            //    config.AddAzureKeyVault(keyVaultEndpoint, new DefaultAzureCredential());
            //})
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
    }
}
