using Core.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.ProductSpecs
{
    public class ProductByCatalogIdSpec : SpecificationBase<Product>
    {
        public ProductByCatalogIdSpec(params int[] categoryIds)
        {
            Query.Where(GetExpression(categoryIds));
        }

        public static Expression<Func<Product, bool>> GetExpression(params int[] categoryIds)
        {
            var propInfo = typeof(Product).GetProperty(nameof(Product.CatalogId));
            var param = Expression.Parameter(typeof(Product));
            var prop = Expression.Property(param, propInfo);

            var aggr = categoryIds.Select(id => Expression.Equal(
                prop,
                Expression.Constant(id, propInfo.PropertyType))
            ).Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

            return Expression.Lambda<Func<Product, bool>>(aggr, param);
        }
    }
}
