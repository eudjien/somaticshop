using AutoMapper;
using Core;
using Core.Common.Sorting;
using Core.Dto;
using Core.Entities;
using Core.Services;
using Core.Specifications.BuyerSpecs;
using IdentityServer4.Extensions;
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
    public class BuyersController : ControllerBase
    {

        private readonly CatalogService _catalogService;
        private readonly ProductService _productService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CatalogsController> _logger;
        private readonly IMapper _mapper;

        public BuyersController(
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
        public async Task<ActionResult<BuyerDto>> GetById([FromRoute] int id)
        {
            var buyer = await _unitOfWork.BuyerRepository.FindByIdAsync(id);
            return _mapper.Map<BuyerDto>(buyer);
        }

        [HttpGet]
        public async Task<IActionResult> Get(
            [FromQuery] int? page = null,
            [FromQuery(Name = "search")] BuyerSearchModel search = null,
            [FromQuery(Name = "sort")] SortModel sort = null,
            [FromQuery] int pageSize = 10)
        {
            var spec = new BuyerFilterSpec();

            if (page.HasValue)
            {
                spec.Query.Paginate((page.Value) * pageSize, pageSize);
            }

            if (!sort.IsNullOrEmpty())
            {

                foreach (var item in sort)
                {
                    if (Enum.TryParse<OrderBy>(item.Value, true, out var order))
                    {
                        if (item.Key.Equals(nameof(Buyer.Email), StringComparison.OrdinalIgnoreCase))
                        {
                            if (order == OrderBy.ASC) { spec.Query.OrderBy(a => a.Email); }
                            else if (order == OrderBy.DESC) { spec.Query.OrderByDescending(a => a.Email); }
                        }
                        if (item.Key.Equals(nameof(Buyer.FirstName), StringComparison.OrdinalIgnoreCase))
                        {
                            if (order == OrderBy.ASC) { spec.Query.OrderBy(a => a.FirstName); }
                            else if (order == OrderBy.DESC) { spec.Query.OrderByDescending(a => a.FirstName); }
                        }
                        if (item.Key.Equals(nameof(Buyer.LastName), StringComparison.OrdinalIgnoreCase))
                        {
                            if (order == OrderBy.ASC) { spec.Query.OrderBy(a => a.LastName); }
                            else if (order == OrderBy.DESC) { spec.Query.OrderByDescending(a => a.LastName); }
                        }
                        if (item.Key.Equals(nameof(Buyer.SurName), StringComparison.OrdinalIgnoreCase))
                        {
                            if (order == OrderBy.ASC) { spec.Query.OrderBy(a => a.SurName); }
                            else if (order == OrderBy.DESC) { spec.Query.OrderByDescending(a => a.SurName); }
                        }
                        if (item.Key.Equals(nameof(Buyer.PhoneNumber), StringComparison.OrdinalIgnoreCase))
                        {
                            if (order == OrderBy.ASC) { spec.Query.OrderBy(a => a.PhoneNumber); }
                            else if (order == OrderBy.DESC) { spec.Query.OrderByDescending(a => a.PhoneNumber); }
                        }
                        if (item.Key.Equals(nameof(Buyer.UserOrAnonymousId), StringComparison.OrdinalIgnoreCase))
                        {
                            if (order == OrderBy.ASC) { spec.Query.OrderBy(a => a.UserOrAnonymousId); }
                            else if (order == OrderBy.DESC) { spec.Query.OrderByDescending(a => a.UserOrAnonymousId); }
                        }
                    }
                }
            }

            var parameter = Expression.Parameter(typeof(Buyer));
            Expression expression = null;

            if (!search.FirstNames.IsNullOrEmpty())
            {
                var firstNamesOrExpression = search.Ids.Distinct().Select(firstName =>
                {
                    var propExpr = Expression.Property(parameter, typeof(Buyer).GetProperty(nameof(Buyer.FirstName)));
                    var constExpr = Expression.Constant(firstName, typeof(string));

                    var method = typeof(string).GetMethod(nameof(Buyer.FirstName.Contains), new[] { typeof(string) });

                    return Expression.Call(propExpr, method, constExpr).Reduce();
                })
                    .Aggregate((expr1, expr2) =>
                    {
                        var expr = Expression.OrElse(expr1, expr2);
                        return expr;
                    });

                if (expression is null)
                {
                    expression = firstNamesOrExpression;
                    _logger.LogInformation(expression.ToString());
                }
                else
                {
                    expression = Expression.AndAlso(expression, firstNamesOrExpression);
                }
            }

            if (!search.LastNames.IsNullOrEmpty())
            {
                var lastNamesOrExpression = search.LastNames.Distinct().Select(lastName =>
                {
                    var propExpr = Expression.Property(parameter, typeof(Buyer).GetProperty(nameof(Buyer.LastName)));
                    var constExpr = Expression.Constant(lastName, typeof(string));

                    var method = typeof(string).GetMethod(nameof(Buyer.LastName.Contains), new[] { typeof(string) });

                    return Expression.Call(propExpr, method, constExpr).Reduce();
                })
                    .Aggregate((expr1, expr2) =>
                    {
                        var expr = Expression.OrElse(expr1, expr2);
                        return expr;
                    });

                if (expression is null)
                {
                    expression = lastNamesOrExpression;
                    _logger.LogInformation(expression.ToString());
                }
                else
                {
                    expression = Expression.AndAlso(expression, lastNamesOrExpression);
                }
            }

            if (!search.SurNames.IsNullOrEmpty())
            {
                var surNamesOrExpression = search.LastNames.Distinct().Select(surName =>
                {
                    var propExpr = Expression.Property(parameter, typeof(Buyer).GetProperty(nameof(Buyer.SurName)));
                    var constExpr = Expression.Constant(surName, typeof(string));

                    var method = typeof(string).GetMethod(nameof(Buyer.SurName.Contains), new[] { typeof(string) });

                    return Expression.Call(propExpr, method, constExpr).Reduce();
                })
                    .Aggregate((expr1, expr2) =>
                    {
                        var expr = Expression.OrElse(expr1, expr2);
                        return expr;
                    });

                if (expression is null)
                {
                    expression = surNamesOrExpression;
                    _logger.LogInformation(expression.ToString());
                }
                else
                {
                    expression = Expression.AndAlso(expression, surNamesOrExpression);
                }
            }

            if (!search.Emails.IsNullOrEmpty())
            {
                var emailsOrExpression = search.LastNames.Distinct().Select(lastName =>
                {
                    var propExpr = Expression.Property(parameter, typeof(Buyer).GetProperty(nameof(Buyer.Email)));
                    var constExpr = Expression.Constant(lastName, typeof(string));

                    var method = typeof(string).GetMethod(nameof(Buyer.Email.Contains), new[] { typeof(string) });

                    return Expression.Call(propExpr, method, constExpr).Reduce();
                })
                    .Aggregate((expr1, expr2) =>
                    {
                        var expr = Expression.OrElse(expr1, expr2);
                        return expr;
                    });

                if (expression is null)
                {
                    expression = emailsOrExpression;
                    _logger.LogInformation(expression.ToString());
                }
                else
                {
                    expression = Expression.AndAlso(expression, emailsOrExpression);
                }
            }

            if (!search.PhoneNumbers.IsNullOrEmpty())
            {
                var phonesOrExpression = search.PhoneNumbers.Distinct().Select(lastName =>
                {
                    var propExpr = Expression.Property(parameter, typeof(Buyer).GetProperty(nameof(Buyer.PhoneNumber)));
                    var constExpr = Expression.Constant(lastName, typeof(string));

                    var method = typeof(string).GetMethod(nameof(Buyer.PhoneNumber.Contains), new[] { typeof(string) });

                    return Expression.Call(propExpr, method, constExpr).Reduce();
                })
                    .Aggregate((expr1, expr2) =>
                    {
                        var expr = Expression.OrElse(expr1, expr2);
                        return expr;
                    });

                if (expression is null)
                {
                    expression = phonesOrExpression;
                    _logger.LogInformation(expression.ToString());
                }
                else
                {
                    expression = Expression.AndAlso(expression, phonesOrExpression);
                }
            }

            if (!search.Ids.IsNullOrEmpty())
            {
                var idsOrExpression = search.Ids.Distinct().Select(id => Expression.Equal(
                        Expression.Property(parameter, typeof(Buyer).GetProperty(nameof(Buyer.Id))),
                        Expression.Constant(id, typeof(int))))
                    .Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

                if (expression is null)
                {
                    expression = idsOrExpression;
                }
                else
                {
                    expression = Expression.AndAlso(expression, idsOrExpression);
                }
            }

            if (!search.UserOrAnonymousIds.IsNullOrEmpty())
            {
                var idsOrExpression = search.UserOrAnonymousIds.Distinct().Select(userOrAnonymousId => Expression.Equal(
                        Expression.Property(parameter, typeof(Buyer).GetProperty(nameof(Buyer.UserOrAnonymousId))),
                        Expression.Constant(userOrAnonymousId, typeof(string))))
                    .Aggregate((expr1, expr2) => Expression.OrElse(expr1, expr2));

                if (expression is null)
                {
                    expression = idsOrExpression;
                }
                else
                {
                    expression = Expression.AndAlso(expression, idsOrExpression);
                }
            }

            if (expression != null)
            {
                _logger.LogInformation(expression.ToString());
                spec.Query.Where(Expression.Lambda<Func<Buyer, bool>>(expression, parameter));
            }

            var items = _mapper.Map<IEnumerable<BuyerDto>>(await _unitOfWork.BuyerRepository.ListAsync(spec));

            if (page.HasValue)
            {
                var totalCount = 0;

                if (expression is null)
                {
                    totalCount = await _unitOfWork.BuyerRepository.CountAsync();
                }
                else
                {
                    var noPagingSpec = new BuyerFilterSpec();
                    spec.Query.Where(Expression.Lambda<Func<Buyer, bool>>(expression, parameter));

                    totalCount = await _unitOfWork.BuyerRepository.CountAsync(noPagingSpec);
                }

                var paginatedList = new Page<BuyerDto>(items, totalCount, page.Value, pageSize);

                return Ok(paginatedList);
            }

            return Ok(items);
        }

    }
}
