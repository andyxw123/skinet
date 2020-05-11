using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Cache;
using Core.Entities.Identity;
using Core.Entities.OrderAggregate;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Product, ProductForReturnDto>()
                .ForMember(dest => dest.ProductBrand, opt => opt.MapFrom(src => src.ProductBrand != null ? src.ProductBrand.Name : null))
                .ForMember(dest => dest.ProductType, opt => opt.MapFrom(src => src.ProductType != null ? src.ProductType.Name : null))
                .ForMember(dest => dest.PictureUrl, opt => opt.MapFrom<ProductUrlResolver>());

            CreateMap<AppUser, UserDto>();

            CreateMap<RegisterDto, AppUser>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email ));

            CreateMap<AppUserAddress, AddressDto>().ReverseMap();

            CreateMap<CustomerBasket, BasketDto>().ReverseMap();
            CreateMap<BasketItem, BasketItemDto>().ReverseMap();

            CreateMap<AddressDto, Core.Entities.OrderAggregate.Address>();

            CreateMap<Order, OrderForReturnDto>()   
                .ForMember(dest => dest.DeliveryMethod, opt => opt.MapFrom(src => src.DeliveryMethod.ShortName))
                .ForMember(dest => dest.ShippingPrice, opt => opt.MapFrom(src => src.DeliveryMethod.Price));

            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ItemOrdered.ProductItemId))
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.ItemOrdered.ProductName))
                .ForMember(dest => dest.PictureUrl, opt => opt.MapFrom<OrderItemUrlResolver>());
        }
    }
}