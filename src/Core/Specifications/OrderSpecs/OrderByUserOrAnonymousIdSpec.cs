using Core.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.OrderSpecs
{
    public class OrderByUserOrAnonymousIdSpec : SpecificationBase<Order>
    {
        public OrderByUserOrAnonymousIdSpec(params string[] orderByUserOrAnonymousIds)
        {
            Query.Where(GetExpression(orderByUserOrAnonymousIds));
        }

        private static Expression<Func<Order, bool>> GetExpression(params string[] orderByUserOrAnonymousIds)
        {
            var propType = typeof(Buyer).GetProperty(nameof(Buyer.UserOrAnonymousId));

            var parameter = Expression.Parameter(typeof(Order));
            var property = Expression.Property(Expression.Property(parameter, nameof(Buyer)), propType.Name);

            var aggr = orderByUserOrAnonymousIds.Select(id =>
            {

                var constant = Expression.Constant(id, propType.PropertyType);
                return Expression.Equal(property, constant);
            }).Aggregate((e1, e2) =>
            {
                return Expression.OrElse(e1, e2);
            });

            return Expression.Lambda<Func<Order, bool>>(aggr, parameter);
        }
    }
}
