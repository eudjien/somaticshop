namespace Core.Dto
{
    public class CatalogDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int? ParentCatalogId { get; set; }
    }
}
