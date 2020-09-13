using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Core.Specifications.ProductSpecs
{
    public class PopularProductsSpec : SpecificationBase<Product>
    {
        public PopularProductsSpec()
        {

            Query.OrderBy(a => a.OrderProducts.Count);
            Query.Include(a => a.OrderProducts);

        }

        //public static Expression<Func<Product, object>> GetExpression()
        //{
        //    var parameter = Expression.Parameter(typeof(Product));
        //    var orderProductsProperty = Expression.Property(parameter, nameof(Product.OrderProducts));
        //    var countProperty = Expression.Property(orderProductsProperty, "Count");
        //    var convert = Expression.Convert(countProperty, typeof(object));
        //    return Expression.Lambda<Func<Product, object>>(convert, parameter);
        //}
    }
}
