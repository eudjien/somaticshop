namespace Core.Entities
{
    public class BasketProduct
    {
        public int BasketId { get; set; }
        public int ProductId { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public Basket Basket { get; set; }
        public Product Product { get; set; }
        public BasketProduct() { }
        public BasketProduct(int basketId, int productId, decimal unitPrice, int quantity)
        {
            BasketId = basketId;
            ProductId = productId;
            UnitPrice = unitPrice;
            Quantity = quantity;
        }
    }
}
