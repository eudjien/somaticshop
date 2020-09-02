namespace Core.Entities
{
    public class ProductImage
    {
        public int ProductId { get; set; }
        public string FileId { get; set; }
        public Product Product { get; set; }
        public File File { get; set; }
        public ProductImage() { }
        public ProductImage(int productId, string fileId)
        {
            ProductId = productId;
            FileId = fileId;
        }
    }
}
