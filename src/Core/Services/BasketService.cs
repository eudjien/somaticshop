using AutoMapper;
using Core.Dto;
using Core.Entities;
using Core.Identity.Managers;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Core.Services
{
    public class BasketService : ServiceBase
    {
        private readonly AppUserManager _userManager;

        public BasketService(IUnitOfWork unitOfWork, AppUserManager userManager, IMapper mapper, ILogger<BasketService> logger)
            : base(unitOfWork, mapper, logger)
        {
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
        }

        public async Task<BasketProductDto> CreateOrUpdateBasketProduct(BasketProductDto basketProductDto)
        {
            var basketProduct = await UnitOfWork.BasketProductRepository
                .FindByIdAsync(basketProductDto.BasketId, basketProductDto.ProductId);

            if (basketProductDto.Quantity > 0)
            {
                if (basketProduct is null)
                {
                    basketProduct = new BasketProduct();
                    Mapper.Map(basketProductDto, basketProduct);
                    UnitOfWork.BasketProductRepository.Add(basketProduct);
                }
                else
                {
                    Mapper.Map(basketProductDto, basketProduct);
                    UnitOfWork.BasketProductRepository.Update(basketProduct);
                }
            }
            else
            {
                if (basketProduct != null)
                {
                    UnitOfWork.BasketProductRepository.Remove(basketProduct);
                }
            }

            await UnitOfWork.SaveChangesAsync();
            return Mapper.Map<BasketProductDto>(basketProduct);
        }

        public async Task DeleteBasketProduct(int basketId, int productId)
        {
            UnitOfWork.BasketProductRepository.Remove(new BasketProduct()
            {
                BasketId = basketId,
                ProductId = productId
            });
            await UnitOfWork.SaveChangesAsync();
        }

    }
}
