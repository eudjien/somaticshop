using Core.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Specifications.BrandSpecs
{
    public class ProductSpecificationNameByNameSpecification : SpecificationBase<ProductSpecificationName>
    {
        public ProductSpecificationNameByNameSpecification(params string[] names)
        {
            Query.Where(GetExpression(names));
        }

        public static Expression<Func<ProductSpecificationName, bool>> GetExpression(params string[] names)
        {
            var propInfo = typeof(ProductSpecificationName).GetProperty(nameof(ProductSpecificationName.Name));
            var param = Expression.Parameter(typeof(ProductSpecificationName));
            var prop = Expression.Property(param, propInfo);

            var aggr = names.Distinct().Select(id => Expression.Equal(
                prop,
                Expression.Constant(id, propInfo.PropertyType))
            ).Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

            return Expression.Lambda<Func<ProductSpecificationName, bool>>(aggr, param);
        }
    }
}
