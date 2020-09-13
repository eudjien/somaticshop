namespace Core.Entities
{
    public class ProductSpec
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int ProductSpecNameId { get; set; }
        public ProductSpecName ProductSpecName { get; set; }
        public ProductSpec() { }
        public ProductSpec(string value, int productSpecNameId, int productId)
        {
            ProductSpecNameId = productSpecNameId;
            Value = value;
            ProductId = productId;
        }
    }
}
