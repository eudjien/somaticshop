using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Core.Common.Expressions
{
    public interface IExpressionCombiner<T>
    {
        Expression<Func<T, bool>> Combine(ExpressionType expressionType);
        List<Expression<Func<T, bool>>> Expressions { get; }
        void Add(Expression<Func<T, bool>> expression);
    }
}
