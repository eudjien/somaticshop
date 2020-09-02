using System;
using System.Linq.Expressions;

namespace Core.Common.Sorting
{
    public class OrderKeyValue<T>
    {
        public OrderBy OrderBy { get; set; } = OrderBy.ASC;
        public Expression<Func<T, object>> OrderByExpression { get; set; }

        public OrderKeyValue()
        {
        }
        public OrderKeyValue(Expression<Func<T, object>> orderByExpression, OrderBy orderBy = OrderBy.ASC)
        {
            OrderBy = orderBy;
            OrderByExpression = orderByExpression;
        }
    }
}
