using Core.Entities;

namespace Core.Specifications.BasketSpecs
{
    public class BasketProductSpec : SpecificationBase<BasketProduct>
    {
        public BasketProductSpec(int basketId, int productId)
        {
            Query.Where(basketProduct => basketProduct.BasketId == basketId && basketProduct.ProductId == productId);
        }
    }
}
