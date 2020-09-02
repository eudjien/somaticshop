using AutoMapper;
using Core.Interfaces;
using Microsoft.Extensions.Logging;
using System.IO;

namespace Core.Services
{
    public class FileService : ServiceBase, IStorage
    {
        public string StoragePath { get; private set; } = Path.Combine(Directory.GetCurrentDirectory(), "Storage");

        public FileService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<FileService> logger)
            : base(unitOfWork, mapper, logger)
        {
        }

        public void Write(Entities.File file, Stream stream)
        {
            using var ofs = new FileStream(Path.Combine(StoragePath, file.Id), FileMode.Create, FileAccess.Write);
            stream.CopyTo(ofs);
        }

        public void Delete(Entities.File file)
        {
            try
            {
                System.IO.File.Delete(Path.Combine(StoragePath, file.Id));
            }
            catch { }
        }
    }
}
