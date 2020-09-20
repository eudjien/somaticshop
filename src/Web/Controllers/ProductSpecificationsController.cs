using AutoMapper;
using Core;
using Core.Dto;
using Core.Entities;
using Core.Services;
using Core.Specifications.ProductSpecs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductSpecificationsController : ControllerBase
    {

        private readonly CatalogService _catalogService;
        private readonly ProductService _productService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ProductsController> _logger;
        private readonly IMapper _mapper;

        public ProductSpecificationsController(
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

        [HttpGet("{catalogId}")]
        public async Task<IActionResult> Get([FromRoute] int catalogId)
        {
            var catalogs = await GetWithParentsRecursive(catalogId);

            var spec = new ProductFilterSpec();
            spec.Query.Where(LambdaExpression(catalogs.Select(a => a.Id)));
            spec.Query.Include(nameof(Product.Specifications));

            var products = await _unitOfWork.ProductRepository.ListAsync(spec);
            var specifications = products.SelectMany(a => a.Specifications);
            var specDtos = _mapper.Map<IEnumerable<ProductSpecificationDto>>(specifications);

            return Ok(specDtos);
        }

        private async Task<List<Catalog>> GetWithParentsRecursive(int catalogId)
        {
            var catalog = await _unitOfWork.CatalogRepository.FindByIdAsync(catalogId);
            if (catalog is null)
            {
                return null;
            }
            var parents = new List<Catalog>(new[] { catalog });
            if (catalog.ParentCatalogId.HasValue)
            {
                parents.AddRange(await GetWithParentsRecursive(catalog.ParentCatalogId.Value));
            }
            return parents;
        }

        private Expression<Func<Product, bool>> LambdaExpression(IEnumerable<int> catalogIds)
        {

            var parameter = Expression.Parameter(typeof(Product));

            var catalogIdsOrExpression = catalogIds.Distinct().Select(catalogId => Expression.Equal(
                    Expression.Property(parameter, typeof(Product).GetProperty(nameof(Product.CatalogId))),
                    Expression.Constant(catalogId, typeof(int?))))
                .Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));



            _logger.LogInformation(catalogIdsOrExpression.ToString());
            return Expression.Lambda<Func<Product, bool>>(catalogIdsOrExpression, parameter);
        }

    }
}
