using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Serilog;
using Service.UserService;
using Web.Models;

namespace Web.Controllers
{
    //[Authorize(Roles = ConstantKey.GeneralRoleName)]
    public class HomeController : BaseController
    {
        private readonly IUserDataService _userDataService;
        public HomeController(IUserDataService userDataService)
        {
            _userDataService = userDataService;
        }
        public IActionResult Index()
        {
            bool consentGiven = false;
            //var exception = new Exception();
            if (User.Identity.IsAuthenticated)
            {
                consentGiven = _userDataService.GetConsentofUser(UserId);
            }
            //Log.Error(exception, "test", "Email Service");
            return View(consentGiven);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
