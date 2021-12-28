using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Service.UserService;

namespace Web.Controllers
{
    [Authorize(Roles = ConstantKey.AdminRoleName)]
    public class AdminController : BaseController
    {
        private readonly IUserDataService _userDataService;
        public AdminController(IUserDataService userDataService)
        {
            _userDataService = userDataService;
        }
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> GetUserList()
        {
            var userList = await _userDataService.GetUserList();
            var result = JsonConvert.SerializeObject(new
            {
                status = "success",
                data = userList
            });

            return Ok(result);
        }

        public IActionResult UserDetail(string id)
        {
            var user = _userDataService.GetUserById(id);
            return View(user);
        }

        [HttpGet]
        public async Task<IActionResult> UpdateStatus(Guid id)
        {
            await _userDataService.ChangeCovidMark(id);
            return Ok();
        }
    }
}