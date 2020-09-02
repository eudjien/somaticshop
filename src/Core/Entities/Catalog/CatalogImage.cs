namespace Core.Entities
{
    public class CatalogImage
    {
        public int CatalogId { get; set; }
        public string FileId { get; set; }
        public Catalog Catalog { get; set; }
        public File File { get; set; }
        public CatalogImage() { }
        public CatalogImage(int catalogId, string fileId)
        {
            CatalogId = catalogId;
            FileId = fileId;
        }
    }
}
