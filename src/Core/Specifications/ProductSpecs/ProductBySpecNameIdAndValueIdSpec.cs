using Core.Entities;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.ProductSpecs
{
    public class ProductBySpecNameIdAndValueIdSpec : SpecificationBase<Product>
    {
        public ProductBySpecNameIdAndValueIdSpec(params KeyValuePair<int, int>[] nameIdValueIdPair)
        {
            Query.Where(GetExpression(nameIdValueIdPair));
        }

        public static Expression<Func<Product, bool>> GetExpression(params KeyValuePair<int, int>[] nameIdValueIdPair)
        {

            var parameter = Expression.Parameter(typeof(Product));
            var property = Expression.Property(parameter, nameof(Product.Specifications));

            var groups = nameIdValueIdPair.GroupBy(a => a.Key);

            Expression expression = null;

            foreach (var group in groups)
            {
                var values = group.Select(a => a.Value);

                var valuesOrExpression = values.Distinct().Select(valueId =>
                {
                    Expression<Func<ProductSpecification, bool>> predicate = a => a.ProductSpecificationNameId == group.Key && a.ProductSpecificationValueId == valueId;

                    return Expression.Call(typeof(Enumerable), "Any", new[] { typeof(ProductSpecification) }, property, predicate);
                }).Select(e => e as Expression).Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

                if (expression is null)
                {
                    expression = valuesOrExpression;
                }
                else
                {
                    expression = Expression.AndAlso(expression, valuesOrExpression);
                }
            }

            return Expression.Lambda<Func<Product, bool>>(expression, parameter);
        }
    }
}
