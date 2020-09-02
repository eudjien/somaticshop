using System.IO;

namespace Core.Common
{
    public class FileData
    {
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public Stream Stream { get; set; }
        public FileData() { }
        public FileData(string fileName, string contentType, Stream stream)
        {
            FileName = fileName;
            ContentType = contentType;
            Stream = stream;
        }
    }
}
