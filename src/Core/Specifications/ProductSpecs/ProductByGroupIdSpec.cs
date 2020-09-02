using Core.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.ProductSpecs
{
    public class ProductByGroupIdSpec : SpecificationBase<Product>
    {
        public ProductByGroupIdSpec(params int[] groupIds)
        {
            Query.Where(GetExpression(groupIds));
        }

        public static Expression<Func<Product, bool>> GetExpression(params int[] groupIds)
        {
            var propInfo = typeof(Product).GetProperty(nameof(Product.GroupId));
            var param = Expression.Parameter(typeof(Product));
            var prop = Expression.Property(param, propInfo);

            var aggr = groupIds.Distinct().Select(id => Expression.Equal(
                prop,
                Expression.Constant(id, propInfo.PropertyType))
            ).Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

            return Expression.Lambda<Func<Product, bool>>(aggr, param);
        }
    }
}
