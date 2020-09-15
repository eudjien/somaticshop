using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Models
{
    public enum ProductSort
    { 
        PriceAsc, 
        PriceDesc, 
        DateAsc, 
        DateDesc, 
        OrdersAsc,
        OrdersDesc,
    }
}
