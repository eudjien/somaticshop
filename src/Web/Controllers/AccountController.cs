using AutoMapper;
using Core;
using Core.Common;
using Core.Common.Sorting;
using Core.Dto;
using Core.Entities;
using Core.Exceptions;
using Core.Identity.Entities;
using Core.Identity.Managers;
using Core.Services;
using Core.Specifications.OrderSpecs;
using Core.Specifications.ProductSpecs;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Threading.Tasks;
using Web.Models;
using Web.Models.Account;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly SignInManager<User> _signInManager;
        private readonly AppUserManager _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly BasketService _basketService;
        private readonly IOptions<IdentityOptions> _identityOptions;
        private readonly ILogger<AccountController> _logger;
        private readonly IMapper _mapper;

        public AccountController(
            UserService userService,
            SignInManager<User> signInManager,
            AppUserManager userManager,
            BasketService basketService,
            IUnitOfWork unitOfWork,
            IOptions<IdentityOptions> identityOptions,
            IMapper mapper,
            ILogger<AccountController> logger)
        {
            _userService = userService;
            _signInManager = signInManager;
            _unitOfWork = unitOfWork;
            _basketService = basketService;
            _identityOptions = identityOptions;
            _logger = logger;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<UserDto>(user));
        }

        [HttpGet("Orders")]
        public async Task<IActionResult> Orders(
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

            var lambdaCombiner = new LambdaExpressionCombiner<Order>(
                new OrderByUserOrAnonymousIdSpec(User.GetSubjectId()).WhereExpressions.First());

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

            var lambda = lambdaCombiner.Combine(ExpressionType.AndAlso);

            _logger.LogInformation(lambda.ToString());

            if (lambda != null)
            {
                spec.Query.Where(lambda);
            }

            var items = _mapper.Map<IEnumerable<OrderDto>>(await _unitOfWork.OrderRepository.ListAsync(spec));

            if (page.HasValue)
            {
                spec.Query.Paginate((page.Value) * pageSize, pageSize);

                var totalCount = 0;

                if (lambda is null)
                {
                    totalCount = await _unitOfWork.OrderRepository.CountAsync();
                }
                else
                {
                    var noPagingSpec = new OrderFilterSpec();
                    spec.Query.Where(lambda);
                    totalCount = await _unitOfWork.OrderRepository.CountAsync(noPagingSpec);
                }

                var paginatedList = new Page<OrderDto>(items, totalCount, page.Value, pageSize);

                return Ok(paginatedList);
            }

            return Ok(items);
        }

        [HttpPut("fullname")]
        public async Task<IActionResult> UpdateFullName([FromBody] ChangeFullNameModel updateFullNameModel)
        {
            try
            {
                var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
                await _userService.UpdateFullName(userId, updateFullNameModel.FirstName, updateFullNameModel.LastName, updateFullNameModel.SurName);
                return Ok();
            }
            catch (NotFoundException ex1)
            {
                return NotFound(ex1.ToString());
            }
            catch (Exception ex)
            {
                if (ex.Data?.Count > 0)
                {
                    return BadRequest(ex.Data);
                }
                return BadRequest();
            }
        }

        [HttpPut("email/{newEmail}")]
        public async Task<IActionResult> UpdateEmail([FromRoute] string newEmail)
        {
            try
            {
                var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
                await _userService.UpdateEmail(userId, newEmail);
                return Ok();
            }
            catch (NotFoundException ex1)
            {
                return NotFound(ex1.ToString());
            }
            catch (Exception ex)
            {
                if (ex.Data?.Count > 0)
                {
                    return BadRequest(ex.Data);
                }
                return BadRequest();
            }
        }

        [HttpPut("phonenumber/{newPhoneNumber}")]
        public async Task<IActionResult> UpdatePhoneNumber([FromRoute] string newPhoneNumber)
        {
            try
            {
                var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
                await _userService.UpdatePhoneNumber(userId, newPhoneNumber);
                return Ok();
            }
            catch (NotFoundException ex1)
            {
                return NotFound(ex1.ToString());
            }
            catch (Exception ex)
            {
                if (ex.Data?.Count > 0)
                {
                    return BadRequest(ex.Data);
                }
                return BadRequest();
            }
        }

        [HttpPut("password")]
        public async Task<IActionResult> UpdatePassword([FromBody] ChangePasswordModel model)
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var user = await _userManager.FindByIdAsync(userId);
            if (user is null)
            {
                return BadRequest();
            }

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok();
        }

        [HttpGet("password/options")]
        public PasswordOptions PasswordOptions()
        {
            return _identityOptions.Value.Password;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] SignInModel input)
        {

            if (!ModelState.IsValid)
            {
                return ValidationProblem();
            }

            var result = await _signInManager.PasswordSignInAsync(input.UserName, input.Password, input.RememberMe, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                return Ok();
            }
            if (result.RequiresTwoFactor)
            {
                return RedirectToPage("./LoginWith2fa", new { RememberMe = input.RememberMe });
            }
            if (result.IsLockedOut)
            {
                return RedirectToPage("./Lockout");
            }

            return BadRequest();
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] SignUpModel input)
        {

            if (!ModelState.IsValid)
            {
                return ValidationProblem();
            }

            var user = new User(input.UserName)
            {
                FirstName = input.FirstName,
                LastName = input.LastName,
                Email = input.Email
            };

            var identityResult = await _userManager.CreateAsync(user, input.Password);

            if (!identityResult.Succeeded)
            {
                return BadRequest(identityResult.Errors);
            }

            return Ok();
        }
    }
}
