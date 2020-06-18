using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    public class BaseController : Controller
    {
        public Guid UserId
        {
            get => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        }
    }
}