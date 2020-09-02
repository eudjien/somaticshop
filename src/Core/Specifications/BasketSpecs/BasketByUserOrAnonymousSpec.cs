using Core.Entities;

namespace Core.Specifications.BasketSpecs
{
    public class BasketByUserOrAnonymousSpec : SpecificationBase<Basket>
    {
        public BasketByUserOrAnonymousSpec(string userOrAnonymousId)
        {
            Query.Where(basket => basket.UserOrAnonymousId == userOrAnonymousId);
        }
    }
}
