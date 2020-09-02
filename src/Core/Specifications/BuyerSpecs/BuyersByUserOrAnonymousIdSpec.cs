using Core.Entities;

namespace Core.Specifications.BuyerSpecs
{
    public class BuyersByUserOrAnonymousIdSpec : SpecificationBase<Buyer>
    {
        public BuyersByUserOrAnonymousIdSpec(string userOrAnonymoysId)
        {
            Query.Include(buyer => buyer.UserOrAnonymousId == userOrAnonymoysId);
        }
    }
}
