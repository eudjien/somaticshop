using Core.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.BrandSpecs
{
    public class BrandByIdSpec : SpecificationBase<Brand>
    {
        public BrandByIdSpec(params int[] brandIds)
        {
            Query.Where(GetExpression(brandIds));
        }

        public static Expression<Func<Brand, bool>> GetExpression(params int[] brandIds)
        {
            var propInfo = typeof(Product).GetProperty(nameof(Brand.Id));
            var param = Expression.Parameter(typeof(Brand));
            var prop = Expression.Property(param, propInfo);

            var aggr = brandIds.Distinct().Select(id => Expression.Equal(
                prop,
                Expression.Constant(id, propInfo.PropertyType))
            ).Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

            return Expression.Lambda<Func<Brand, bool>>(aggr, param);
        }
    }
}
