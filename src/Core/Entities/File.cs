using System;

namespace Core.Entities
{
    public class File
    {
        public string Id { get; private set; } = Guid.NewGuid().ToString();
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public File() { }
        public File(string fileName, string contentType)
        {
            FileName = fileName;
            ContentType = contentType;
        }
    }
}
