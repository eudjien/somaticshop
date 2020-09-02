namespace Core.Entities
{
    public class OrderProduct
    {
        public int OrderId { get; private set; }
        public int ProductId { get; private set; }
        public decimal UnitPrice { get; private set; }
        public int Quantity { get; private set; }
        public Order Order { get; private set; }
        public Product Product { get; private set; }
        public OrderProduct() { }
        public OrderProduct(int orderId, int productId, decimal unitPrice, int quantity)
        {
            OrderId = orderId;
            ProductId = productId;
            UnitPrice = unitPrice;
            Quantity = quantity;
        }
    }
}
