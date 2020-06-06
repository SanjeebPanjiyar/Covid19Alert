using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure;
using Infrastructure.BaseViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.UserService;

namespace Web.Controllers
{
    public class AccountController : BaseController
    {
        private readonly IUserDataService _userDataService;
        public AccountController(IUserDataService userDataService)
        {
            _userDataService = userDataService;
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
            await _userDataService.SigninUser(user.EmailAddress, user.Password);
            return Ok();
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