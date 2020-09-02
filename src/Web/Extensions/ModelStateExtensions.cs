using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Collections;
using System.Linq;

namespace Web.Extensions
{
    public static class ModelStateExtensions
    {
        public static IEnumerable ToSimpleArray(this ModelStateDictionary keyValuePairs)
        {
            return keyValuePairs?.Select(a => new { Name = a.Key, Errors = a.Value.Errors.Select(errors => errors.ErrorMessage) });
        }
    }
}
