using AutoMapper;
using Core;
using Core.Common.Sorting;
using Core.Dto;
using Core.Exceptions;
using Core.Services;
using Core.Specifications.ProductSpecs;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductGroupsController : ControllerBase
    {

        private readonly ProductService _productService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ProductGroupsController> _logger;
        private readonly IMapper _mapper;

        public ProductGroupsController(
            ProductService productService,
            IUnitOfWork unitOfWork,
            ILogger<ProductGroupsController> logger,
            IMapper mapper)
        {
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
                var spec = new ProductGroupFilterSpec();

                if (page.HasValue)
                {
                    spec.Query.Paginate((page.Value) * pageSize, pageSize);
                }

                if (sortTitle != null)
                {
                    var orderBy = sortTitle.Equals("desc", StringComparison.OrdinalIgnoreCase) ? OrderBy.DESC : OrderBy.ASC;
                    if (orderBy == OrderBy.ASC) { spec.Query.OrderBy(a => a.Name); }
                    else if (orderBy == OrderBy.DESC) { spec.Query.OrderByDescending(a => a.Name); }
                }

                if (!string.IsNullOrWhiteSpace(search))
                {
                    spec.Query.Where(productGroup => productGroup.Name.Contains(search));
                }

                var items = _mapper.Map<IEnumerable<ProductGroupDto>>(await _unitOfWork.ProductGroupRepository.ListAsync(spec));

                var totalCount = 0;

                if (spec.WhereExpressions.IsNullOrEmpty())
                {
                    totalCount = await _unitOfWork.ProductGroupRepository.CountAsync();
                }
                else
                {
                    var noPagingSpec = new ProductGroupFilterSpec();
                    noPagingSpec.Query.Where(productGroup => productGroup.Name.Contains(search));
                    totalCount = await _unitOfWork.ProductGroupRepository.CountAsync(noPagingSpec);
                }

                var paginatedList = new Page<ProductGroupDto>(items, totalCount, page.Value, pageSize);

                return Ok(paginatedList);
            }

            return Ok(_mapper.Map<IEnumerable<ProductGroupDto>>(await _unitOfWork.ProductGroupRepository.ListAsync()));
        }

        [HttpGet("{groupId}/products")]
        public async Task<IEnumerable<ProductDto>> GroupProducts([FromRoute] int groupId)
        {
            return _mapper.Map<IEnumerable<ProductDto>>(
                (await _unitOfWork.ProductGroupRepository.FindOneAsync(
                    new ProductGroupWithProductsSpec(groupId))).Products);
        }

        [HttpGet("{groupId}")]
        public async Task<ProductGroupDto> GetById([FromRoute] int groupId)
        {
            return _mapper.Map<ProductGroupDto>(await _unitOfWork.ProductGroupRepository.FindByIdAsync(groupId));
        }

        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] ProductGroupDto productGroupDto,
            [FromQuery(Name = "productId")] int[] productIds = null)
        {
            try
            {
                await _productService.CreateProductGroupAsync(productGroupDto, productIds);
                return CreatedAtAction(nameof(GetById), new { productId = productGroupDto.Id }, productGroupDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update(
            [FromBody] ProductGroupDto productGroupDto,
            [FromQuery(Name = "productId")] int[] productIds = null)
        {
            try
            {
                await _productService.UpdateProductGroupAsync(productGroupDto, productIds);
                return CreatedAtAction(nameof(GetById), new { productId = productGroupDto.Id }, productGroupDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(
            [FromQuery(Name = "productGroupId")] int[] productGroupIds)
        {
            try
            {
                await _productService.DeleteProductGroupAsync(productGroupIds);
            }
            catch (NotFoundException ex1)
            {
                return NotFound(ex1.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
            return Ok();
        }
    }
}
