
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Web.Extensions
{
    public static class ConfigurationExtensions
    {
        public static string GetStorageFolderPath(this IConfiguration configuration)
        {
            return Path.Combine(Directory.GetCurrentDirectory(), configuration.GetSection("StorageFolder").Value);
        }
    }
}
