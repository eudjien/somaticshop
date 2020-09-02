using AutoMapper;
using Core.Dto;
using Core.Entities;
using Core.Exceptions;
using Core.Identity.Entities;
using Core.Specifications.BasketSpecs;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Services
{
    public class OrderService : ServiceBase
    {
        private readonly UserManager<User> _userManager;

        public OrderService(IUnitOfWork unitOfWork, UserManager<User> userManager, IMapper mapper, ILogger<OrderService> logger)
            : base(unitOfWork, mapper, logger)
        {
            _userManager = userManager;
        }

        public async Task<OrderDto> CreateOrderAsync(BuyerDto buyerDto, AddressDto addressDto, string comment)
        {

            var basket = await UnitOfWork.BasketRepository
                .FindOneAsync(new BasketWithBasketProductsByUserOrAnonymousSpec(buyerDto.UserOrAnonymousId));
            if (basket is null)
            {
                throw new BasketNotExistException();
            }
            if (basket.BasketProducts?.Count < 1)
            {
                throw new BasketIsEmptyException();
            }

            var order = new Order
            {
                Date = DateTimeOffset.UtcNow,
                Comment = comment,
                Status = DeliveryStatus.Statement,
                Buyer = Mapper.Map<Buyer>(buyerDto),
            };
            order.Address = (await UnitOfWork.AddressRepository.FindByIdAsync(addressDto.Id)) ?? Mapper.Map<Address>(addressDto);
            order.OrderProducts = Mapper.Map<IEnumerable<OrderProduct>>(basket.BasketProducts)?.ToList();

            UnitOfWork.OrderRepository.Add(order);
            UnitOfWork.BasketProductRepository.RemoveRange(basket.BasketProducts);
            await UnitOfWork.SaveChangesAsync();

            return Mapper.Map<OrderDto>(order);
        }

        public async Task<IEnumerable<OrderDto>> UpdateOrdersAsync(OrderDto[] orderDtos)
        {
            var orders = Mapper.Map<IEnumerable<Order>>(orderDtos);
            if (orders is null)
            {
                throw new NotFoundException();
            }

            UnitOfWork.OrderRepository.UpdateRange(orders);
            await UnitOfWork.SaveChangesAsync();
            return Mapper.Map<IEnumerable<OrderDto>>(orders);
        }

        public async Task DeleteOrderAsync(int orderId)
        {
            var order = await UnitOfWork.OrderRepository.FindByIdAsync(orderId);
            if (order is null)
            {
                throw new NotFoundException(nameof(orderId));
            }

            UnitOfWork.OrderRepository.Remove(order);
            await UnitOfWork.SaveChangesAsync();
        }
    }
}
