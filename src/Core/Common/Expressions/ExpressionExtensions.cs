using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Common
{
    public static class ExpressionExtensions
    {
        public static Expression<Func<T, bool>> CombineWith<T>(this Expression<Func<T, bool>> expression,
            ExpressionType expressionType, params Expression<Func<T, bool>>[] expressions)
        {
            var combiner = new LambdaExpressionCombiner<T>(new[] { expression }.Concat(expressions).ToArray());
            return combiner.Combine(expressionType);
        }
    }
}
