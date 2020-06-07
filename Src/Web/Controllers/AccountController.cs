using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Core.Entities;
using Infrastructure;
using Infrastructure.BaseViewModel;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Service.UserService;

namespace Web.Controllers
{
    public class AccountController : BaseController
    {
        private readonly IUserDataService _userDataService;
        private readonly SignInManager<ApplicationUser> _signInManager;
        public AccountController(IUserDataService userDataService,
            SignInManager<ApplicationUser> signInManager)
        {
            _userDataService = userDataService;
            _signInManager = signInManager;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] BaseLoginViewModel user)
        {
            if (ModelState.IsValid)
            {
                await HttpContext.SignOutAsync();
                HttpContext.Session.Clear();

                var signInModel = await _userDataService.SigninUser(user.EmailAddress, user.Password);
                if(signInModel.Login==Service.Enum.LoginEnum.Successful)
                {
                    List<Claim> claims = new List<Claim>
                    {
                            new Claim(ClaimTypes.Role, signInModel.User.Role),
                            new Claim(ClaimTypes.NameIdentifier, signInModel.User.Id.ToString())
                    };
                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                           new ClaimsPrincipal(claimsIdentity),
                           new AuthenticationProperties
                           {
                               ExpiresUtc = DateTime.UtcNow.AddMinutes(60),
                               IsPersistent = true,
                               AllowRefresh = true
                           });

                    return Ok();
                }
                else
                {
                    return BadRequest(signInModel.Login);
                }
               
            }
            return BadRequest();
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Registration()
        {
            return View();
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BaseApplicationUserViewModel user)
        {
            await _userDataService.CreateUser(user, ConstantKey.GeneralRoleName);
            return Ok();
        }
    }
}