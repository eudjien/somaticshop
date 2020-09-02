using AutoMapper;
using Core;
using Core.Common;
using Core.Common.Sorting;
using Core.Dto;
using Core.Entities;
using Core.Exceptions;
using Core.Services;
using Core.Specifications.BrandSpecs;
using Core.Specifications.CatalogSpecs;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BrandsController : ControllerBase
    {

        private readonly BrandService _brandService;
        private readonly ProductService _productService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<BrandsController> _logger;
        private readonly IMapper _mapper;

        public BrandsController(
            BrandService brandService,
            ProductService productService,
            IUnitOfWork unitOfWork,
            ILogger<BrandsController> logger,
            IMapper mapper)
        {
            _brandService = brandService ?? throw new ArgumentNullException(nameof(brandService));
            _productService = productService ?? throw new ArgumentNullException(nameof(productService));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        [HttpGet]
        public async Task<IActionResult> Get(
            [FromQuery] int? page = null,
            [FromQuery] string sortTitle = null,
            [FromQuery] string search = null,
            [FromQuery] int pageSize = 10)
        {

            if (page.HasValue)
            {
                var spec = new BrandFilterSpec();
                spec.Query.Paginate((page.Value - 1) * pageSize, pageSize);

                if (sortTitle != null)
                {
                    var orderBy = sortTitle.Equals("desc", StringComparison.OrdinalIgnoreCase) ? OrderBy.DESC : OrderBy.ASC;
                    if (orderBy == OrderBy.ASC) { spec.Query.OrderBy(a => a.Id); }
                    else if (orderBy == OrderBy.DESC) { spec.Query.OrderByDescending(a => a.Id); }
                }

                if (!string.IsNullOrWhiteSpace(search))
                {
                    spec.Query.Where(brand => brand.Title.Contains(search));
                }

                var items = _mapper.Map<IEnumerable<BrandDto>>(await _unitOfWork.BrandRepository.GetBySpecAsync(spec));

                var totalCount = 0;

                if (spec.WhereExpressions.IsNullOrEmpty())
                {
                    totalCount = await _unitOfWork.BrandRepository.GetAllCountAsync();
                }
                else
                {
                    var noPagingSpec = new BrandFilterSpec();
                    noPagingSpec.Query.Where(brand => brand.Title.Contains(search));
                    totalCount = await _unitOfWork.BrandRepository.GetBySpecCountAsync(noPagingSpec);
                }

                var paginatedList = new Page<BrandDto>(items, totalCount, page.Value, pageSize);

                return Ok(paginatedList);
            }

            return Ok(_mapper.Map<IEnumerable<BrandDto>>(await _unitOfWork.BrandRepository.GetAllAsync()));
        }

        [HttpGet("{brandId}")]
        public async Task<ActionResult<BrandDto>> GetById(int brandId)
        {
            var brand = await _unitOfWork.BrandRepository.FindByIdAsync(brandId);
            if (brand is null)
            {
                return NotFound();
            }
            return _mapper.Map<BrandDto>(brand);
        }

        [HttpGet("{brandId}/products/{productId}")]
        public async Task<ActionResult<BrandDto>> GetBrandProduct(int brandId, int productId)
        {
            var spec = new ProductOfBrandSpec(brandId, productId);

            var product = await _unitOfWork.ProductRepository.FindOneAsync(spec);
            if (product is null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<ProductDto>(product));
        }

        [HttpGet("{brandId}/products")]
        public async Task<IActionResult> GetBrandProducts(int brandId)
        {
            var spec = new BrandByIdSpec(brandId);
            spec.Query.Include(nameof(Brand.Products));

            var brandWithProducts = await _unitOfWork.BrandRepository.FindOneAsync(spec);
            if (brandWithProducts is null)
            {
                return NotFound($"Brand with id: {brandId} not found");
            }

            return Ok(_mapper.Map<IEnumerable<ProductDto>>(brandWithProducts?.Products));
        }

        [Authorize(Roles = AppRoles.Admin)]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm(Name = "brand")] BrandDto brandDto)
        {
            try
            {
                var formFile = Request.Form.Files.FirstOrDefault(a => a.Name == "image");

                var fileData = _mapper.Map<FileData>(formFile);
                await _brandService.CreateBrandAsync(brandDto, fileData);

                return CreatedAtAction(nameof(GetById), new { brandId = brandDto.Id }, brandDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [Authorize(Roles = AppRoles.Admin)]
        [HttpPut]
        public async Task<IActionResult> Update([FromForm(Name = "brand")] BrandDto brandDto)
        {
            try
            {
                var formFile = Request.Form.Files.FirstOrDefault(a => a.Name == "image");

                var fileData = _mapper.Map<FileData>(formFile);
                await _brandService.UpdateBrandAsync(brandDto, fileData);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [Authorize(Roles = AppRoles.Admin)]
        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery(Name = "brandId")] int[] brandIds)
        {
            try
            {
                await _brandService.DeleteBrandsAsync(brandIds);
            }
            catch (NotFoundException ex1)
            {
                return NotFound(ex1.Message);
            }
            catch
            {
                return BadRequest();
            }
            return Ok();
        }

        [HttpGet("{brandId}/image")]
        public async Task<ActionResult<BrandImageDto>> GetImage(int brandId)
        {
            try
            {
                return await _brandService.GetBrandImageAsync(brandId);
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
