using Core.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.ProductSpecs
{
    public class ProductByIdSpec : SpecificationBase<Product>
    {
        public ProductByIdSpec(params int[] productIds)
        {
            Query.Where(GetExpression(productIds));
        }

        public static Expression<Func<Product, bool>> GetExpression(params int[] productIds)
        {
            var propInfo = typeof(Product).GetProperty(nameof(Product.Id));
            var param = Expression.Parameter(typeof(Product));
            var prop = Expression.Property(param, propInfo);

            var aggr = productIds.Distinct().Select(id => Expression.Equal(
                prop,
                Expression.Constant(id, propInfo.PropertyType))
            ).Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

            return Expression.Lambda<Func<Product, bool>>(aggr, param);
        }
    }
}
