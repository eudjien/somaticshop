using Core.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.OrderSpecs
{
    public class OrderByBuyerIdSpec : SpecificationBase<Order>
    {
        public OrderByBuyerIdSpec(params int[] buyerIds)
        {
            Query.Where(GetExpression(buyerIds));
        }

        private static Expression<Func<Order, bool>> GetExpression(params int[] buyerIds)
        {
            var propInfo = typeof(Order).GetProperty(nameof(Order.BuyerId));
            var param = Expression.Parameter(typeof(Order));
            var prop = Expression.Property(param, propInfo);

            var aggr = buyerIds.Distinct().Select(id => Expression.Equal(
                prop,
                Expression.Constant(id, propInfo.PropertyType))
            ).Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

            return Expression.Lambda<Func<Order, bool>>(aggr, param);
        }
    }
}
