using Core.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.ProductSpecs
{
    public class ProductByNameContainsSpec : SpecificationBase<Product>
    {
        public ProductByNameContainsSpec(params string[] titles)
        {
            Query.Where(GetExpression(titles));
        }

        public static Expression<Func<Product, bool>> GetExpression(params string[] names)
        {
            var parameter = Expression.Parameter(typeof(Product));

            var orExpr = names.Distinct().Select(title =>
            {
                var propExpr = Expression.Property(parameter, typeof(Product).GetProperty(nameof(Product.Name)));
                var constExpr = Expression.Constant(title, typeof(string));

                var method = typeof(string).GetMethod(nameof(Product.Name.Contains), new[] { typeof(string) });

                return Expression.Call(propExpr, method, constExpr).Reduce();
            }).Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

            return Expression.Lambda<Func<Product, bool>>(orExpr, parameter);
        }
    }
}
