using Core.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.ProductSpecs
{
    public class ProductByBrandIdSpec : SpecificationBase<Product>
    {
        public ProductByBrandIdSpec(params int[] brandIds)
        {
            Query.Where(GetExpression(brandIds));
        }

        public static Expression<Func<Product, bool>> GetExpression(params int[] brandIds)
        {
            var propInfo = typeof(Product).GetProperty(nameof(Product.BrandId));
            var param = Expression.Parameter(typeof(Product));
            var prop = Expression.Property(param, propInfo);

            var aggr = brandIds.Select(id => Expression.Equal(
                prop,
                Expression.Constant(id, propInfo.PropertyType))
            ).Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

            return Expression.Lambda<Func<Product, bool>>(aggr, param);
        }
    }
}
