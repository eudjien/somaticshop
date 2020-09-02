using Core.Entities;

namespace Core.Specifications.OrderSpecs
{
    public class OrderProductsByOrderIdSpec : SpecificationBase<OrderProduct>
    {
        public OrderProductsByOrderIdSpec(int orderId)
        {
            Query.Where(orderProduct => orderProduct.OrderId == orderId);
        }
    }
}
