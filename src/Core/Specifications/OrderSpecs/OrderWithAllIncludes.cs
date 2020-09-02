using Ardalis.Specification;
using Core.Entities;

namespace Core.Specifications.OrderSpecs
{
    public class OrderWithAllIncludes : Specification<Order>
    {
        public OrderWithAllIncludes(int orderId)
        {
            Query.Where(order => order.Id == orderId);
            Query.Include(nameof(Order.Address))
                .Include(nameof(Order.Buyer))
                .Include(nameof(Order.OrderProducts));
        }
    }
}
