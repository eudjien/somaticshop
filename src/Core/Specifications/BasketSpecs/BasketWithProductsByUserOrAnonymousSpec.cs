using Core.Entities;

namespace Core.Specifications.BasketSpecs
{
    public class BasketWithProductsByUserOrAnonymousSpec : SpecificationBase<Basket>
    {
        public BasketWithProductsByUserOrAnonymousSpec(string userOrAnonymousId)
        {
            Query.Where(basket => basket.UserOrAnonymousId == userOrAnonymousId);
            Query.Include($"{nameof(Basket.BasketProducts)}.{nameof(BasketProduct.Product)}");
        }
    }
}
