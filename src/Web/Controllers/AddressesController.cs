using AutoMapper;
using Core;
using Core.Dto;
using Core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AddressesController : ControllerBase
    {

        private readonly CatalogService _catalogService;
        private readonly ProductService _productService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CatalogsController> _logger;
        private readonly IMapper _mapper;

        public AddressesController(
            CatalogService catalogService,
            ProductService productService,
            IUnitOfWork unitOfWork,
            ILogger<CatalogsController> logger,
            IMapper mapper)
        {


            _catalogService = catalogService ?? throw new ArgumentNullException(nameof(catalogService));
            _productService = productService ?? throw new ArgumentNullException(nameof(productService));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        [HttpGet("{id}")]
        public async Task<AddressDto> GetById([FromRoute] int id)
        {
            var address = await _unitOfWork.AddressRepository.FindByIdAsync(id);
            return _mapper.Map<AddressDto>(address);
        }
    }
}
