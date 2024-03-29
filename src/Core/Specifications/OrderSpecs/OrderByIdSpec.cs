﻿using Core.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.OrderSpecs
{
    public class OrderByIdSpec : SpecificationBase<Order>
    {
        public OrderByIdSpec(params int[] orderIds)
        {
            Query.Where(GetExpression(orderIds));
        }

        private static Expression<Func<Order, bool>> GetExpression(params int[] orderIds)
        {
            var propInfo = typeof(Order).GetProperty(nameof(Order.Id));
            var param = Expression.Parameter(typeof(Order));
            var prop = Expression.Property(param, propInfo);

            var aggr = orderIds.Distinct().Select(id => Expression.Equal(
                prop,
                Expression.Constant(id, propInfo.PropertyType))
            ).Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

            return Expression.Lambda<Func<Order, bool>>(aggr, param);
        }
    }
}
