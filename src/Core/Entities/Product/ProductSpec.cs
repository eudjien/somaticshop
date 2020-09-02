namespace Core.Entities
{
    public class ProductSpec
    {
        public int Id { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public ProductSpec() { }
        public ProductSpec(string key, string value, int productId)
        {
            Key = key;
            Value = value;
            ProductId = productId;
        }
    }
}
