namespace Core.Entities
{
    public class ProductSpecification
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int ProductSpecificationNameId { get; set; }
        public ProductSpecificationName ProductSpecificationName { get; set; }
        public ProductSpecification() { }
        public ProductSpecification(string value, int productSpecificationNameId, int productId)
        {
            ProductSpecificationNameId = productSpecificationNameId;
            Value = value;
            ProductId = productId;
        }
    }
}
