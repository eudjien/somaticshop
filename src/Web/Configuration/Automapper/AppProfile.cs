using AutoMapper;
using Core.Common;
using Microsoft.AspNetCore.Http;

namespace Web.Configuration.Automapper
{

    public class AppProfile : Profile
    {
        public AppProfile()
        {
            CreateMap<IFormFile, FileData>()
                .ForMember(fileData => fileData.Stream, src => src.MapFrom(formFile => formFile.OpenReadStream()));
        }
    }
}
