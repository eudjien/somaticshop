using Core.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.OrderSpecs
{
    public class OrderByStatusSpec : SpecificationBase<Order>
    {
        public OrderByStatusSpec(params DeliveryStatus[] deliveryStatuses)
        {
            Query.Where(GetExpression(deliveryStatuses));
        }

        private static Expression<Func<Order, bool>> GetExpression(params DeliveryStatus[] deliveryStatuses)
        {
            var propInfo = typeof(Order).GetProperty(nameof(Order.Status));
            var param = Expression.Parameter(typeof(Order));
            var prop = Expression.Property(param, propInfo);

            var aggr = deliveryStatuses.Distinct().Select(status => Expression.Equal(
                prop,
                Expression.Constant(status, propInfo.PropertyType))
            ).Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

            return Expression.Lambda<Func<Order, bool>>(aggr, param);
        }
    }
}
