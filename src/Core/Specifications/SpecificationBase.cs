using Ardalis.Specification;

namespace Core.Specifications
{
    public class SpecificationBase<T> : Specification<T>
    {
        public new ISpecificationBuilder<T> Query { get; }
        public SpecificationBase()
        {
            this.Query = base.Query;
        }
    }
}
