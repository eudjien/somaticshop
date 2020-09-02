using AutoMapper;
using Core.Entities;

namespace Infrastructure.Configuration.Automapper
{
    public class EntityProfile : Profile
    {
        public EntityProfile()
        {
            AllowNullCollections = true;
            AllowNullDestinationValues = true;

            CreateMap<OrderProduct, BasketProduct>();
            CreateMap<BasketProduct, OrderProduct>();
        }
    }
}
