using Core.Entities;

namespace Core.Specifications.FileSpecs
{
    public class FileByIdSpec : SpecificationBase<File>
    {
        public FileByIdSpec(string fileId)
        {
            Query.Where(f => f.Id == fileId);
        }
    }
}
