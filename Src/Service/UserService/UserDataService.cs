using Core.Entities;
using Core.Entitities;
using Core.Interfaces;
using Infrastructure.BaseViewModel;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Serilog;
using Service.BaseViewModel;
using Service.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Service.UserService
{
    public class UserDataService : IUserDataService
    {
        private readonly RoleManager<IdentityApplicationRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IRepository _repository;

        public UserDataService(RoleManager<IdentityApplicationRole> roleManager,
            UserManager<ApplicationUser> userManager,
            IRepository repository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _repository = repository;
        }

        private async Task<ApplicationUser> GetUserByEmail(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }

        public async Task<IdentityResult> CreateUser(BaseApplicationUserViewModel user, string roleName)
        {
            var userToCreate = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.EmailAddress,
                PhoneNumber = user.PhoneNumber,
                NormalizedUserName = user.EmailAddress.ToUpper(),
                Email = user.EmailAddress,
                NormalizedEmail = user.EmailAddress.ToUpper(),
                SecurityStamp = Guid.NewGuid().ToString(),
                ConcurrencyStamp = Guid.NewGuid().ToString(),
                IdNumber = user.IdNumber.ToUpper(),
                TwoFactorEnabled = false,
                LockoutEnabled = false,
                AccessFailedCount = 0,
                IsDeleted = false,
                EntryDate = DateTime.UtcNow,
            };
            var result = await _userManager.CreateAsync(userToCreate, user.Password);
            var role = await _roleManager.FindByNameAsync(roleName: roleName);
            if (result.Succeeded)
            {
                result = await _userManager.AddToRoleAsync(userToCreate, role.NormalizedName);
            }
            return result;

        }

        public async Task<SignInResponseModel> SigninUser(string email, string password)
        {

            var responseModel = new SignInResponseModel();
            var user = await GetUserByEmail(email);

            if (user != null)
            {
                if (await _userManager.CheckPasswordAsync(user, password))
                {
                    try
                    {
                        responseModel.User = new BaseApplicationUserViewModel()
                        {
                            Id = user.Id,
                            Role = user.UserRoles.First().Role.Name
                        };
                    }
                    catch (Exception e)
                    {
                        Log.Error(e, e.Message);
                        responseModel.Login = LoginEnum.SignInError;
                        return responseModel;
                    }
                    responseModel.Login = LoginEnum.Successful;
                }
                else
                {
                    responseModel.Login = LoginEnum.PasswordMismatch;
                }

            }
            else
            {
                responseModel.Login = LoginEnum.EmailNotFound;
            }

            return responseModel;
        }

        public async Task<IList<BaseApplicationUserViewModel>> GetUserList(int pageIndex = 0, int count = 10, string IdNumber = null)
        {
            var userList = _repository.Query<ApplicationUser>();

            if (!string.IsNullOrEmpty(IdNumber))
            {
                userList = userList.Where(x => x.IdNumber.Equals(IdNumber));
            }
            userList = userList.Skip(pageIndex * count).Take(count);

            var userModelList = await Task.Run(() => userList.Select(x => new BaseApplicationUserViewModel
            {
                FirstName = x.FirstName,
                LastName = x.LastName,
                IdNumber = x.IdNumber,
                Id = x.Id
            }).ToList());

            return userModelList;
        }

        public bool GetConsentofUser(Guid UserId)
        {
            return _repository.Query<ApplicationUser>().Where(x => x.Id.Equals(UserId)).FirstOrDefault().ConsentGiven;
        }

        public async Task UpdateConsent(Guid UserId)
        {
            var user = await _userManager.FindByIdAsync(UserId.ToString());
            user.ConsentGiven = true;
            await _userManager.UpdateAsync(user);
        }
    }
}
