using AutoMapper;
using Core;
using Core.Dto;
using Core.Entities;
using Core.Identity.Entities;
using Core.Identity.Managers;
using Core.Services;
using Core.Specifications.BasketSpecs;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserBasketController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly SignInManager<User> _signInManager;
        private readonly AppUserManager _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly BasketService _basketService;
        private readonly IOptions<IdentityOptions> _identityOptions;
        private readonly ILogger<AccountController> _logger;
        private readonly IMapper _mapper;

        public UserBasketController(
            UserService userService,
            SignInManager<User> signInManager,
            AppUserManager userManager,
            BasketService basketService,
            IUnitOfWork unitOfWork,
            IOptions<IdentityOptions> identityOptions,
            IMapper mapper,
            ILogger<AccountController> logger)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _signInManager = signInManager ?? throw new ArgumentNullException(nameof(signInManager));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _basketService = basketService ?? throw new ArgumentNullException(nameof(basketService));
            _identityOptions = identityOptions ?? throw new ArgumentNullException(nameof(identityOptions));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        [HttpGet]
        public async Task<BasketDto> Get([FromQuery] string userOrAnonymousId = null)
        {
            var basketUserOrAnonymousId = await SyncBasket(userOrAnonymousId);
            var basket = await GetUserOrAnonymousBasketAsync(basketUserOrAnonymousId);
            return _mapper.Map<BasketDto>(basket);
        }

        [HttpGet("{productId}")]
        public async Task<BasketProductDto> GetBasketProduct([FromRoute] int productId, [FromQuery] string userOrAnonymousId = null)
        {
            var basketUserOrAnonymousId = await SyncBasket(userOrAnonymousId);
            var basket = await GetUserOrAnonymousBasketAsync(basketUserOrAnonymousId);
            if (basket is null)
            {
                return null;
            }
            var basketProduct = await _unitOfWork.BasketProductRepository.FindOneAsync(new BasketProductSpec(basket.Id, productId));
            return _mapper.Map<BasketProductDto>(basketProduct);
        }

        [HttpPut]
        public async Task<IActionResult> CreateOrUpdateBasketProduct(
            [FromQuery] int productId,
            [FromQuery] int quantity,
            [FromQuery] string userOrAnonymousId = null)
        {
            var basketUserOrAnonymousId = await SyncBasket(userOrAnonymousId);
            try
            {
                var basket = await GetOrCreateBasketAsync(basketUserOrAnonymousId);

                var dto = new BasketProductDto
                {
                    BasketId = basket.Id,
                    ProductId = productId,
                    UnitPrice = (await _unitOfWork.ProductRepository.FindByIdAsync(productId)).Price,
                    Quantity = quantity
                };

                var res = await _basketService.CreateOrUpdateBasketProduct(dto);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [HttpGet("products")]
        public async Task<IEnumerable<BasketProductDto>> GetBasketProducts([FromQuery] string userOrAnonymousId = null)
        {
            var basketUserOrAnonymousId = await SyncBasket(userOrAnonymousId);

            var basket = await _unitOfWork.BasketRepository.FindOneAsync(
                new BasketWithBasketProductsByUserOrAnonymousSpec(basketUserOrAnonymousId));

            return _mapper.Map<IEnumerable<BasketProductDto>>(basket?.BasketProducts) ?? new List<BasketProductDto>();
        }

        [HttpDelete("product")]
        public async Task<ActionResult> DeleteBasketProduct([FromQuery] int productId, [FromQuery] string userOrAnonymousId = null)
        {
            var basketUserOrAnonymousId = await SyncBasket(userOrAnonymousId);
            try
            {
                var basket = await GetUserOrAnonymousBasketAsync(basketUserOrAnonymousId);
                if (basket == null)
                {
                    return Ok();
                }
                await _basketService.DeleteBasketProduct(basket.Id, productId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        private async Task<Basket> GetUserOrAnonymousBasketAsync(string userOrAnonymousId)
        {
            return await _unitOfWork.BasketRepository.FindOneAsync(
                    new BasketByUserOrAnonymousSpec(_signInManager.IsSignedIn(User) ? User.GetSubjectId() : userOrAnonymousId));
        }

        private async Task<Basket> GetOrCreateBasketAsync(string userOrAnonymousId)
        {
            var basket = await GetUserOrAnonymousBasketAsync(userOrAnonymousId);
            if (basket is null)
            {
                var newBasket = new Basket(userOrAnonymousId);
                _unitOfWork.BasketRepository.Add(newBasket);
                await _unitOfWork.SaveChangesAsync();
                return newBasket;
            }
            return basket;
        }

        private async Task TransferBasket(string anonymousId, string userId)
        {
            var anonymousBasket = await _unitOfWork.BasketRepository.FindOneAsync(
                new BasketByUserOrAnonymousSpec(anonymousId));

            if (anonymousBasket?.BasketProducts?.Count > 0)
            {
                var userBasket = await _unitOfWork.BasketRepository.FindOneAsync(
                    new BasketByUserOrAnonymousSpec(userId));

                anonymousBasket.UserOrAnonymousId = userId;

                _unitOfWork.BasketRepository.Update(anonymousBasket);

                if (userBasket != null)
                {
                    _unitOfWork.BasketRepository.Remove(userBasket);
                }

                await _unitOfWork.SaveChangesAsync();
            }
        }

        private async Task<string> SyncBasket(string userOrAnonymousId = null)
        {
            string syncValue;
            if (_signInManager.IsSignedIn(User))
            {
                if (Guid.TryParse(userOrAnonymousId, out _) && User.GetSubjectId() != userOrAnonymousId)
                {
                    await TransferBasket(userOrAnonymousId, User.GetSubjectId());
                }
                syncValue = User.GetSubjectId();
                Response.Headers.Add(AppConstants.BASKET_COOKIE_KEY, new StringValues(new[] { syncValue }));
                return syncValue;
            }
            syncValue = Guid.TryParse(userOrAnonymousId, out _) ? userOrAnonymousId : Guid.NewGuid().ToString();
            Response.Headers.Add(AppConstants.BASKET_COOKIE_KEY, syncValue);
            return syncValue;
        }
    }
}
