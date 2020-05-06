using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;

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
        }
    }
}