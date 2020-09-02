using System.IO;

namespace Core.Interfaces
{
    public interface IStorage
    {
        string StoragePath { get; }
        void Write(Entities.File file, Stream stream);
        void Delete(Entities.File file);
    }
}
