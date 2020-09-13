using Core.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.ProductSpecs
{
    public class ProductByBrandNameSpec : SpecificationBase<Product>
    {
        public ProductByBrandNameSpec(params string[] brandNames)
        {
            Query.Where(GetExpression(brandNames));
        }

        public static Expression<Func<Product, bool>> GetExpression(string[] brandNames)
        {
            var param = Expression.Parameter(typeof(Product));
            var brandProp = Expression.Property(param, nameof(Product.Brand));
            var brandNameProp = Expression.Property(brandProp, nameof(Brand.Name));

            var aggr = brandNames.Select(brandName => Expression.Equal(
                brandNameProp,
                Expression.Constant(brandName, typeof(string)))
            ).Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

            return Expression.Lambda<Func<Product, bool>>(aggr, param);
        }
    }
}

