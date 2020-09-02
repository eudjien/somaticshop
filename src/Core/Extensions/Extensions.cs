using System;

namespace Core.Extensions
{
    public static class Extensions
    {

        public static void Ex<T>(Func<T, object> selector) where T : class
        {
            var res = selector.Invoke(null);
            var propName = res.GetType().Name;

        }

    }
}
