using Core.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.ProductSpecs
{
    public class OrderByCommentContainsSpec : SpecificationBase<Order>
    {
        public OrderByCommentContainsSpec(params string[] comments)
        {
            Query.Where(GetExpression(comments));
        }

        private static Expression<Func<Order, bool>> GetExpression(params string[] comments)
        {
            var parameter = Expression.Parameter(typeof(Order));

            var orExpr = comments.Distinct().Select(title =>
            {
                var propExpr = Expression.Property(parameter, typeof(Order).GetProperty(nameof(Order.Comment)));
                var constExpr = Expression.Constant(title, typeof(string));

                var method = typeof(string).GetMethod(nameof(Order.Comment.Contains), new[] { typeof(string) });

                return Expression.Call(propExpr, method, constExpr).Reduce();
            }).Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

            return Expression.Lambda<Func<Order, bool>>(orExpr, parameter);
        }
    }
}
