namespace Core.Entities
{
    public class ProductSpecification
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int ProductSpecificationNameId { get; set; }
        public int ProductSpecificationValueId { get; set; }
        public ProductSpecificationName ProductSpecificationName { get; set; }
        public ProductSpecificationValue ProductSpecificationValue { get; set; }
        public ProductSpecification() { }
        public ProductSpecification(int productSpecificationNameId, int productSpecificationValueId, int productId)
        {
            ProductSpecificationNameId = productSpecificationNameId;
            ProductSpecificationValueId = productSpecificationValueId;
            ProductId = productId;
        }
    }
}
