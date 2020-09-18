namespace Core.Dto
{
    public class ProductGroupSpecificationDto
    {
        public int Id { get; set; }
        public int ProductSpecificationNameId { get; set; }
        public string Value { get; set; }
        public int GroupId { get; set; }
    }
}
