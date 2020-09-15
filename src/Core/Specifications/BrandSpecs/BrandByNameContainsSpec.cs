using Core.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.BrandSpecs
{
    public class BrandByNameContainsSpec : SpecificationBase<Brand>
    {
        public BrandByNameContainsSpec(params string[] titles)
        {
            Query.Where(GetExpression(titles));
        }

        public static Expression<Func<Brand, bool>> GetExpression(params string[] names)
        {
            var parameter = Expression.Parameter(typeof(Brand));

            var orExpr = names.Distinct().Select(name =>
            {
                var propExpr = Expression.Property(parameter, typeof(Brand).GetProperty(nameof(Brand.Name)));
                var constExpr = Expression.Constant(name, typeof(string));

                var method = typeof(string).GetMethod(nameof(Brand.Name.Contains), new[] { typeof(string) });

                return Expression.Call(propExpr, method, constExpr).Reduce();
            }).Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

            return Expression.Lambda<Func<Brand, bool>>(orExpr, parameter);
        }
    }
}
