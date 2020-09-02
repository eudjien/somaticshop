namespace Core.Entities
{
    public class BrandImage
    {
        public int BrandId { get; set; }
        public string FileId { get; set; }
        public Brand Brand { get; set; }
        public File File { get; set; }
        public BrandImage() { }
        public BrandImage(int barndId, string fileId)
        {
            BrandId = barndId;
            FileId = fileId;
        }
    }
}
