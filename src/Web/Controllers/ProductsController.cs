using AutoMapper;
using Core;
using Core.Common;
using Core.Common.Sorting;
using Core.Dto;
using Core.Entities;
using Core.Exceptions;
using Core.Services;
using Core.Specifications.ProductSpecs;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {

        private readonly CatalogService _catalogService;
        private readonly ProductService _productService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ProductsController> _logger;
        private readonly IMapper _mapper;

        private IEnumerable<IFormFile> FormFileImages =>
            Request.Form.Files.Where(a => a.Name.Equals("image", StringComparison.OrdinalIgnoreCase));

        public ProductsController(
            CatalogService catalogService,
            ProductService productService,
            IUnitOfWork unitOfWork,
            ILogger<ProductsController> logger,
            IMapper mapper)
        {
            _catalogService = catalogService ?? throw new ArgumentNullException(nameof(catalogService));
            _productService = productService ?? throw new ArgumentNullException(nameof(productService));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        [HttpGet]
        public async Task<IActionResult> Get(
           [FromQuery] int? page = null,
           [FromQuery(Name = "search")] ProductSearchModel search = null,
           [FromQuery(Name = "sort")] SortModel sort = null,
           [FromQuery(Name = "spec")] List<string[]> specs = null,
           [FromQuery] int pageSize = 10)
        {

            var spec = new ProductFilterSpec();

            if (!sort.IsNullOrEmpty())
            {

                foreach (var item in sort)
                {
                    if (Enum.TryParse<OrderBy>(item.Value, true, out var order))
                    {
                        if (item.Key.Equals(nameof(Product.Title), StringComparison.OrdinalIgnoreCase))
                        {
                            if (order == OrderBy.ASC) { spec.Query.OrderBy(a => a.Title); }
                            else if (order == OrderBy.DESC) { spec.Query.OrderByDescending(a => a.Title); }
                        }
                        if (item.Key.Equals(nameof(Product.Price), StringComparison.OrdinalIgnoreCase))
                        {
                            if (order == OrderBy.ASC) { spec.Query.OrderBy(a => a.Price); }
                            else if (order == OrderBy.DESC) { spec.Query.OrderByDescending(a => a.Price); }
                        }
                        if (item.Key.Equals(nameof(Product.Date), StringComparison.OrdinalIgnoreCase))
                        {
                            if (order == OrderBy.ASC) { spec.Query.OrderBy(a => a.Date); }
                            else if (order == OrderBy.DESC) { spec.Query.OrderByDescending(a => a.Date); }
                        }
                    }
                }
            }

            var lambdaCombiner = new LambdaExpressionCombiner<Product>();

            if (!search.Titles.IsNullOrEmpty())
            {
                lambdaCombiner.Add(new ProductByTitleContainsSpec(search.Titles).WhereExpressions.First());
            }

            if (!search.Ids.IsNullOrEmpty())
            {
                lambdaCombiner.Add(new ProductByIdSpec(search.Ids).WhereExpressions.First());
            }

            if (!search.GroupIds.IsNullOrEmpty())
            {
                lambdaCombiner.Add(new ProductByGroupIdSpec(search.GroupIds).WhereExpressions.First());
            }

            if (!search.CatalogIds.IsNullOrEmpty())
            {
                lambdaCombiner.Add(new ProductByCatalogIdSpec(search.CatalogIds).WhereExpressions.First());
            }

            if (!search.BrandIds.IsNullOrEmpty())
            {
                lambdaCombiner.Add(new ProductByBrandIdSpec(search.BrandIds).WhereExpressions.First());
            }

            if (!specs.IsNullOrEmpty())
            {
                lambdaCombiner.Add(new ProductBySpecsSpec(
                    specs.Select(a => new KeyValuePair<string, string>(a[0], a[1])).ToArray()).WhereExpressions.First());
            }

            var lambda = lambdaCombiner.Combine(ExpressionType.AndAlso);

            if (lambda != null)
            {
                spec.Query.Where(lambda);
            }

            if (page.HasValue)
            {
                spec.Query.Paginate((page.Value - 1) * pageSize, pageSize);

                var totalCount = 0;

                if (lambda is null)
                {
                    totalCount = await _unitOfWork.ProductRepository.GetAllCountAsync();
                }
                else
                {
                    var noPagingSpec = new ProductFilterSpec();
                    noPagingSpec.Query.Where(lambda);
                    totalCount = await _unitOfWork.ProductRepository.GetBySpecCountAsync(noPagingSpec);
                }

                var items = _mapper.Map<IEnumerable<ProductDto>>(await _unitOfWork.ProductRepository.GetBySpecAsync(spec));
                var paginatedList = new Page<ProductDto>(items, totalCount, page.Value, pageSize);

                return Ok(paginatedList);
            }

            return Ok(_mapper.Map<IEnumerable<ProductDto>>(await _unitOfWork.ProductRepository.GetBySpecAsync(spec)));
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetById(
            [FromRoute] int productId)
        {
            return Ok(_mapper.Map<ProductDto>(await _unitOfWork.ProductRepository.FindByIdAsync(productId)));
        }

        [HttpGet("{productId}/brand")]
        public async Task<BrandDto> ProductBrand([FromRoute] int productId)
        {
            var product = await _unitOfWork.ProductRepository.FindOneAsync(new ProductWithBrandSpec(productId));
            if (product is null)
            {
                throw new NotFoundException($"Product with id: {productId} not found.");
            }
            return _mapper.Map<BrandDto>(product.Brand);
        }

        [Authorize(Roles = AppRoles.Admin)]
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromForm(Name = "product")] ProductDto productDto,
            [FromForm(Name = "specification")] ProductSpecDto[] specs = null)
        {
            try
            {
                var fileDatas = _mapper.Map<IEnumerable<FileData>>(FormFileImages);
                await _productService.CreateProductAsync(productDto, fileDatas, specs);
                return CreatedAtAction(nameof(GetById), new { productId = productDto.Id }, productDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [Authorize(Roles = AppRoles.Admin)]
        [HttpPut]
        public async Task<IActionResult> Update(
            [FromForm(Name = "product")] ProductDto productDto,
            [FromForm(Name = "specification")] ProductSpecDto[] specs = null)
        {
            try
            {
                var fileDatas = _mapper.Map<IEnumerable<FileData>>(FormFileImages);
                await _productService.UpdateProductAsync(productDto, fileDatas, specs);
                return Ok();
            }
            catch (NotFoundException ex1)
            {
                return NotFound(ex1.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [Authorize(Roles = AppRoles.Admin)]
        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery(Name = "productId")] int[] productIds)
        {
            try
            {
                await _productService.DeleteProductsAsync(productIds);
                return Ok();
            }
            catch (NotFoundException ex1)
            {
                return NotFound(ex1.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [HttpGet("{productId}/images")]
        public async Task<IEnumerable<FileDto>> Images([FromRoute] int productId)
        {
            return await _productService.GetProductImagesAsync(productId);
        }

        [HttpGet("{productId}/images/first")]
        public async Task<FileDto> FirstImage([FromRoute] int productId)
        {
            var spec = new ProductImagesSpec(productId);
            var productImage = await _unitOfWork.ProductImageRepository.FindFirstAsync(spec);

            return _mapper.Map<FileDto>(productImage.File);
        }

        [HttpGet("{productId}/specifications")]
        public async Task<IEnumerable<ProductSpecDto>> Specifications([FromRoute] int productId)
        {
            var productWithSpecs = await _unitOfWork.ProductRepository.FindOneAsync(new ProductWithSpecificationsSpec(productId));
            return _mapper.Map<IEnumerable<ProductSpecDto>>(productWithSpecs.Specifications);
        }
    }
}
