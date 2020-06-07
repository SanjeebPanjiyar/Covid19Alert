using Core.Entities;
using Infrastructure.BaseViewModel;
using Microsoft.AspNetCore.Identity;
using Service.BaseViewModel;
using Service.Enum;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Service.UserService
{
    public interface IUserDataService
    {
        public Task<IdentityResult> CreateUser(BaseApplicationUserViewModel user, string roleName);

        public Task<SignInResponseModel> SigninUser(string email, string password);
    }
}
