namespace Core.Dto
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Date { get; set; }
        public int? CatalogId { get; set; }
        public int? BrandId { get; set; }
        public int? GroupId { get; set; }
    }
}
