using Core.Common.Expressions;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Common
{
    public class LambdaExpressionCombiner<T> : IExpressionCombiner<T>
    {
        private readonly UpdateParameterVisitor combiner = new UpdateParameterVisitor();
        public List<Expression<Func<T, bool>>> Expressions => combiner.Expressions;

        public LambdaExpressionCombiner(params Expression<Func<T, bool>>[] expressions)
        {
            if (expressions != null && expressions.Any())
            {
                Expressions.AddRange(expressions);
            }
        }

        public Expression<Func<T, bool>> Combine(ExpressionType expressionType)
        {
            if (!Expressions.Any())
            {
                return null;
            }

            var newParamExprs = combiner.Visit(new ReadOnlyCollection<Expression>(Expressions.ToArray()));

            var newBody = newParamExprs.Select(e => (e as Expression<Func<T, bool>>).Body)
                .Aggregate((b1, b2) => Expression.MakeBinary(expressionType, b1, b2));

            var lambda = Expression.Lambda<Func<T, bool>>(newBody, combiner.Parameter);

            Expressions.Clear();

            return lambda;
        }

        public void Add(Expression<Func<T, bool>> expression)
        {
            Expressions.Add(expression);
        }

        private class UpdateParameterVisitor : ExpressionVisitor
        {
            public ParameterExpression Parameter { get; } = Expression.Parameter(typeof(T));
            public List<Expression<Func<T, bool>>> Expressions { get; private set; } = new List<Expression<Func<T, bool>>>();

            public UpdateParameterVisitor(params Expression<Func<T, bool>>[] expressions)
            {
                if (expressions != null && expressions.Any())
                {
                    Expressions.AddRange(expressions);
                }
            }
            protected override Expression VisitParameter(ParameterExpression node)
                => Expressions.Any(e => e.Parameters.First() == node) ? Parameter : node;

            public void Add(Expression<Func<T, bool>> expression) =>
                Expressions.Add(expression);
        }
    }
}
