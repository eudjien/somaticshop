using Core.Entities;

namespace Core.Specifications.BasketSpecs
{
    public class BasketProductsByBasketIdSpec : SpecificationBase<BasketProduct>
    {
        public BasketProductsByBasketIdSpec(int basketId)
        {
            Query.Where(basketProduct => basketProduct.BasketId == basketId);
        }
    }
}
