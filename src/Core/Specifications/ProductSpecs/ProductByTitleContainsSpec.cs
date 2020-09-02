using Core.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.ProductSpecs
{
    public class ProductByTitleContainsSpec : SpecificationBase<Product>
    {
        public ProductByTitleContainsSpec(params string[] titles)
        {
            Query.Where(GetExpression(titles));
        }

        public static Expression<Func<Product, bool>> GetExpression(params string[] titles)
        {
            var parameter = Expression.Parameter(typeof(Product));

            var orExpr = titles.Distinct().Select(title =>
            {
                var propExpr = Expression.Property(parameter, typeof(Product).GetProperty(nameof(Product.Title)));
                var constExpr = Expression.Constant(title, typeof(string));

                var method = typeof(string).GetMethod(nameof(Product.Title.Contains), new[] { typeof(string) });

                return Expression.Call(propExpr, method, constExpr).Reduce();
            }).Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

            return Expression.Lambda<Func<Product, bool>>(orExpr, parameter);
        }
    }
}
