using AutoMapper;
using Core.Dto;
using Core.Identity.Entities;
using Core.Identity.Repositories;
using Core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {

        private readonly UserService _userService;
        private readonly ILogger<UsersController> _logger;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;

        public UsersController(UserService userService, IUserRepository userRepository, ILogger<UsersController> logger, IMapper mapper)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        [HttpGet("find/id/{id}")]
        public async Task<ActionResult<UserDto>> GetById(string id)
        {
            var user = await _userService.UserManager.FindByIdAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            var userDto = _mapper.Map<UserDto>(User);

            return userDto;
        }

        [HttpGet("find/username/{username}")]
        public async Task<ActionResult<User>> GetByUserName(string username)
        {
            var user = await _userService.UserManager.FindByNameAsync(username);

            if (user is null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpGet("find/email/{email}")]
        public async Task<ActionResult<User>> GetByEmail(string email)
        {
            var user = await _userService.UserManager.FindByEmailAsync(email);

            if (user is null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpGet]
        public async Task<IEnumerable<UserDto>> GetAllUsers()
        {
            var userDtos = _mapper.Map<IEnumerable<UserDto>>(await _userRepository.ListAsync());
            return userDtos;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromQuery] UserDto userDto)
        {
            if (id != userDto.Id)
            {
                return BadRequest();
            }

            var user = await _userService.UserManager.FindByIdAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            try
            {
                _mapper.Map(userDto, user);
                await _userService.UserManager.UpdateAsync(user);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _userService.UserManager.FindByIdAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            var idntRes = await _userService.UserManager.DeleteAsync(user);

            if (!idntRes.Succeeded)
            {
                return BadRequest(idntRes.Errors);
            }

            return Ok();
        }

        [HttpGet("confirm/email/{userId}")]
        public async Task<IActionResult> ConfirmEmail(string userId, [FromQuery] string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                return BadRequest();
            }

            var user = await _userService.UserManager.FindByIdAsync(userId);

            if (user is null)
            {
                return NotFound();
            }

            var idntRes = await _userService.UserManager.ConfirmEmailAsync(user, token);

            if (!idntRes.Succeeded)
            {
                return BadRequest(idntRes.Errors);
            }

            return Ok();
        }
    }
}
