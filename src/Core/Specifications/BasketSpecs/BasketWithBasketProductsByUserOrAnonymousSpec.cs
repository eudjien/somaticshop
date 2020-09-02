using Core.Entities;

namespace Core.Specifications.BasketSpecs
{
    public class BasketWithBasketProductsByUserOrAnonymousSpec : SpecificationBase<Basket>
    {
        public BasketWithBasketProductsByUserOrAnonymousSpec(string userOrAnonymousId)
        {
            Query.Where(basket => basket.UserOrAnonymousId == userOrAnonymousId);
            Query.Include($"{nameof(Basket.BasketProducts)}");
        }
    }
}
