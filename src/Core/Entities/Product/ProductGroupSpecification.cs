namespace Core.Entities
{
    public class ProductGroupSpecification
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public int ProductGroupId { get; set; }
        public ProductGroup ProductGroup { get; set; }
        public int ProductSpecificationNameId { get; set; }
        public ProductSpecificationName ProductSpecificationName { get; set; }
        public ProductGroupSpecification() { }
        public ProductGroupSpecification(string value, int productSpecificationNameId, int productGroupId)
        {
            ProductSpecificationNameId = productSpecificationNameId;
            Value = value;
            ProductGroupId = productGroupId;
        }
    }
}
