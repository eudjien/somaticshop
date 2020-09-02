using AutoMapper;
using Core;
using Core.Common;
using Core.Common.Sorting;
using Core.Dto;
using Core.Entities;
using Core.Exceptions;
using Core.Interfaces.Repositories;
using Core.Services;
using Core.Specifications.OrderSpecs;
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
    public class OrdersController : ControllerBase
    {

        private readonly OrderService _orderService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderProductRepository _orderProductRepository;
        private readonly ILogger<OrdersController> _logger;
        private readonly IMapper _mapper;

        public OrdersController(
            OrderService orderService,
            IOrderRepository orderRepository,
            IOrderProductRepository orderProductRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILogger<OrdersController> logger)
        {
            _orderService = orderService ?? throw new ArgumentNullException(nameof(orderService));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
            _orderProductRepository = orderProductRepository ?? throw new ArgumentNullException(nameof(orderProductRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet("{id}")]
        public async Task<OrderDto> GetOrderById(int id)
        {
            var order = await _orderRepository.FindByIdAsync(id);
            return _mapper.Map<OrderDto>(order);
        }

        [HttpGet("{orderId}/products/{productId}")]
        public async Task<OrderProductDto> GetOrderProductById([FromRoute] int orderId, [FromRoute] int productId)
        {
            var orderProduct = await _orderProductRepository.FindByIdAsync(orderId, productId);
            return _mapper.Map<OrderProductDto>(orderProduct);
        }

        [HttpGet("{orderId}/products")]
        public async Task<IEnumerable<OrderProductDto>> GetOrderProducts(int orderId)
        {
            var orderProducts = await _orderProductRepository.GetBySpecAsync(
                new OrderProductsByOrderIdSpec(orderId));
            return _mapper.Map<IEnumerable<OrderProductDto>>(orderProducts);
        }

        [HttpGet]
        public async Task<IActionResult> Get(
           [FromQuery] int? page = null,
           [FromQuery(Name = "search")] OrderSearchModel search = null,
           [FromQuery(Name = "sort")] SortModel sort = null,
           [FromQuery] int pageSize = 10)
        {

            var spec = new OrderFilterSpec();

            if (!sort.IsNullOrEmpty())
            {
                foreach (var item in sort)
                {
                    if (Enum.TryParse<OrderBy>(item.Value, true, out var order))
                    {
                        if (item.Key.Equals(nameof(Order.Id), StringComparison.OrdinalIgnoreCase))
                        {
                            if (order == OrderBy.ASC) { spec.Query.OrderBy(a => a.Id); }
                            else if (order == OrderBy.DESC) { spec.Query.OrderByDescending(a => a.Id); }
                        }
                        if (item.Key.Equals(nameof(Order.Comment), StringComparison.OrdinalIgnoreCase))
                        {
                            if (order == OrderBy.ASC) { spec.Query.OrderBy(a => a.Comment); }
                            else if (order == OrderBy.DESC) { spec.Query.OrderByDescending(a => a.Comment); }
                        }
                        if (item.Key.Equals(nameof(Order.Date), StringComparison.OrdinalIgnoreCase))
                        {
                            if (order == OrderBy.ASC) { spec.Query.OrderBy(a => a.Date); }
                            else if (order == OrderBy.DESC) { spec.Query.OrderByDescending(a => a.Date); }
                        }
                    }
                }
            }

            var lambdaCombiner = new LambdaExpressionCombiner<Order>();

            if (!search.Ids.IsNullOrEmpty())
            {
                lambdaCombiner.Add(new OrderByIdSpec(search.Ids).WhereExpressions.First());
            }

            if (!search.Comments.IsNullOrEmpty())
            {
                lambdaCombiner.Add(new OrderByCommentContainsSpec(search.Comments).WhereExpressions.First());
            }

            if (!search.BuyerIds.IsNullOrEmpty())
            {
                lambdaCombiner.Add(new OrderByBuyerIdSpec(search.BuyerIds).WhereExpressions.First());
            }

            if (!search.AddressIds.IsNullOrEmpty())
            {
                lambdaCombiner.Add(new OrderByAddressIdSpec(search.AddressIds).WhereExpressions.First());
            }

            if (!search.Statuses.IsNullOrEmpty())
            {
                lambdaCombiner.Add(new OrderByStatusSpec(search.Statuses).WhereExpressions.First());
            }

            if (!search.UserOrAnonymousIds.IsNullOrEmpty())
            {
                lambdaCombiner.Add(new OrderByUserOrAnonymousIdSpec(search.UserOrAnonymousIds).WhereExpressions.First());
            }

            var lambda = lambdaCombiner.Combine(ExpressionType.AndAlso);

            if (lambda != null)
            {
                spec.Query.Where(lambda);
            }

            var items = _mapper.Map<IEnumerable<OrderDto>>(await _unitOfWork.OrderRepository.GetBySpecAsync(spec));

            if (page.HasValue)
            {
                spec.Query.Paginate((page.Value - 1) * pageSize, pageSize);

                var totalCount = 0;

                if (lambda is null)
                {
                    totalCount = await _unitOfWork.OrderRepository.GetAllCountAsync();
                }
                else
                {
                    var noPagingSpec = new OrderFilterSpec();
                    spec.Query.Where(lambda);
                    totalCount = await _unitOfWork.OrderRepository.GetBySpecCountAsync(noPagingSpec);
                }

                var paginatedList = new Page<OrderDto>(items, totalCount, page.Value, pageSize);

                return Ok(paginatedList);
            }

            return Ok(items);
        }

        [Authorize(Roles = AppRoles.Admin)]
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromForm(Name = "buyer")] BuyerDto buyerDto,
            [FromForm(Name = "address")] AddressDto addressDto,
            [FromForm] string comment)
        {
            try
            {
                var orderDto = await _orderService.CreateOrderAsync(buyerDto, addressDto, comment);
                return CreatedAtAction(nameof(GetOrderById), new { id = orderDto.Id }, orderDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [Authorize(Roles = AppRoles.Admin)]
        [HttpPut]
        public async Task<ActionResult<IEnumerable<OrderDto>>> Update([FromBody] OrderDto[] orderDtos)
        {
            try
            {
                return Ok(await _orderService.UpdateOrdersAsync(orderDtos));
            }
            catch (NotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }
    }
}
