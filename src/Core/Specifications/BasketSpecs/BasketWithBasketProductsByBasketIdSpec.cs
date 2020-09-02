using Core.Entities;

namespace Core.Specifications.BasketSpecs
{
    public class BasketWithBasketProductsByBasketIdSpec : SpecificationBase<Basket>
    {
        public BasketWithBasketProductsByBasketIdSpec(int basketId)
        {
            Query.Where(basket => basket.Id == basketId);
            Query.Include(nameof(Basket.BasketProducts));
        }
    }
}
