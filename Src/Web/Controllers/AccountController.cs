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
using Service.BaseViewModel;
using Service.UserService;
using Web.CustomAttribute;
using Newtonsoft.Json;

namespace Web.Controllers
{
    public class AccountController : BaseController
    {
        private readonly IUserDataService _userDataService;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IUserLocationService _userLocationService;
        public AccountController(IUserDataService userDataService,
            SignInManager<ApplicationUser> signInManager,
            IUserLocationService userLocationService)
        {
            _userDataService = userDataService;
            _signInManager = signInManager;
            _userLocationService = userLocationService;
        }
        private async Task signIn(SignInResponseModel signInModel)
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
        }

        private async Task signOut()
        {
            await HttpContext.SignOutAsync();
            HttpContext.Session.Clear();
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> LogOut()
        {
            await HttpContext.SignOutAsync();
            HttpContext.Session.Clear();
            return RedirectToAction("Login");
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Login()
        {
            if(User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index","Home");
            }
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] BaseLoginViewModel user)
        {
            if (ModelState.IsValid)
            {
                await signOut();
                var signInModel = await _userDataService.SigninUser(user.EmailAddress, user.Password);
                if(signInModel.Login==Service.Enum.LoginEnum.Successful)
                {
                    await signIn(signInModel);
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
        [AnonymousOnly]
        public IActionResult Registration()
        {
            return View();
        }
        public IActionResult UserList()
        {
            return View();
        }
        public async Task<IActionResult> GetUserList()
        {
            List<BaseApplicationUserViewModel> userList = new List<BaseApplicationUserViewModel>() {
                new BaseApplicationUserViewModel(){  FirstName="Imtiaz", LastName="Ahmed" , IdNumber="0001" , PhoneNumber = "01715052564" , EmailAddress="imtiazaiuib1@gmail.com" },
            
            };
            var result = JsonConvert.SerializeObject(userList);
            //var json = JsonSerializer.Serialize(userList);
            return Ok(result);
            //return View();  
            //return json;

        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BaseApplicationUserViewModel user)
        {
            await _userDataService.CreateUser(user, ConstantKey.GeneralRoleName);
            return Ok();
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> GetCountOfNearByPatients([FromBody]LocationViewModel location)
        {
            var count =await _userLocationService.GetCountNearbyLocationAndSetLocation(UserId,location.Latitude, location.Longitude);
            return Ok(count);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SetConsent()
        {
            await _userDataService.UpdateConsent(UserId); 
            return Ok();
        }
    }
}