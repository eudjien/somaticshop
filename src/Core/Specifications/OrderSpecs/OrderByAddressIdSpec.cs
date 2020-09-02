using Core.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.OrderSpecs
{
    public class OrderByAddressIdSpec : SpecificationBase<Order>
    {
        public OrderByAddressIdSpec(params int[] addressIds)
        {
            Query.Where(GetExpression(addressIds));
        }

        private static Expression<Func<Order, bool>> GetExpression(params int[] addressIds)
        {
            var propInfo = typeof(Order).GetProperty(nameof(Order.AddressId));
            var param = Expression.Parameter(typeof(Order));
            var prop = Expression.Property(param, propInfo);

            var aggr = addressIds.Distinct().Select(id => Expression.Equal(
                prop,
                Expression.Constant(id, propInfo.PropertyType))
            ).Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

            return Expression.Lambda<Func<Order, bool>>(aggr, param);
        }
    }
}
