namespace Core.Dto
{
    public class BasketProductDto
    {
        public int BasketId { get; set; }
        public int ProductId { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
    }
}
