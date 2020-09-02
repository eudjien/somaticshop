using Core.Entities;
using System;
using System.Linq.Expressions;

namespace Core.Specifications.ProductSpecs
{
    public class ProductByPriceRangeSpec : SpecificationBase<Product>
    {
        public ProductByPriceRangeSpec(decimal? from, decimal? to)
        {
            Query.Where(GetExpression(from, to));
        }

        public static Expression<Func<Product, bool>> GetExpression(decimal? from, decimal? to)
        {
            if (!from.HasValue && !to.HasValue)
            {
                return null;
            }

            var propInfo = typeof(Product).GetProperty(nameof(Product.Price));
            var param = Expression.Parameter(typeof(Product));
            var prop = Expression.Property(param, typeof(Product).GetProperty(nameof(Product.Price)));

            Expression expression = null;

            if (from.HasValue)
            {
                var constantFrom = Expression.Constant(from.Value, propInfo.PropertyType);
                expression = Expression.GreaterThanOrEqual(prop, constantFrom);
            }

            if (to.HasValue)
            {
                var constantTo = Expression.Constant(to.Value, propInfo.PropertyType);
                var lessThanOrEqual = Expression.LessThanOrEqual(prop, constantTo);
                expression = expression is null ? lessThanOrEqual : Expression.AndAlso(expression, lessThanOrEqual);
            }

            return Expression.Lambda<Func<Product, bool>>(expression, param);
        }
    }
}
