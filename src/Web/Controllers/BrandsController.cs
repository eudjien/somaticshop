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
using Core.Specifications.ProductSpecs;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Web.Models;

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
            [FromQuery(Name = "pageIndex")] int? pageIndex = null,
            [FromQuery(Name = "search")] BrandSearch search = null,
            [FromQuery(Name = "sort")] BrandSort? sort = null,
            [FromQuery(Name = "pageSize")] int pageSize = 10)
        {

            var spec = new BrandFilterSpec();

            if (sort != null)
            {
                switch (sort)
                {
                    case BrandSort.ProductsAsc:
                        spec.Query.OrderBy(a => a.Products.Count);
                        break;
                    case BrandSort.ProductsDesc:
                        spec.Query.OrderByDescending(a => a.Products.Count);
                        break;
                    default:
                        break;
                }
            }

            var lambdaCombiner = new LambdaExpressionCombiner<Brand>();

            if (search != null)
            {
                if (!search.Ids.IsNullOrEmpty())
                {
                    lambdaCombiner.Add(new BrandByIdSpec(search.Ids).WhereExpressions.First());
                }
                if (!search.Names.IsNullOrEmpty())
                {
                    lambdaCombiner.Add(new BrandByNameContainsSpec(search.Names).WhereExpressions.First());
                }
            }

            var lambda = lambdaCombiner.Combine(ExpressionType.AndAlso);

            if (lambda != null)
            {
                spec.Query.Where(lambda);
            }

            if (pageIndex.HasValue)
            {
                spec.Query.Paginate(pageIndex.Value * pageSize, pageSize);

                var totalCount = 0;

                if (lambda is null)
                {
                    totalCount = await _unitOfWork.BrandRepository.CountAsync();
                }
                else
                {
                    var noPagingSpec = new BrandFilterSpec();
                    noPagingSpec.Query.Where(lambda);
                    totalCount = await _unitOfWork.BrandRepository.CountAsync(noPagingSpec);
                }

                var items = _mapper.Map<IEnumerable<BrandDto>>(await _unitOfWork.BrandRepository.ListAsync(spec));
                var paginatedList = new Page<BrandDto>(items, totalCount, pageIndex.Value, pageSize);

                return Ok(paginatedList);
            }

            return Ok(_mapper.Map<IEnumerable<BrandDto>>(await _unitOfWork.BrandRepository.ListAsync()));
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
