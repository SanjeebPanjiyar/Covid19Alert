using Core.Entities;
using Core.Entitities;
using Infrastructure.BaseViewModel;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Service.UserService
{
    public class UserDataService : IUserDataService
    {
        private readonly RoleManager<IdentityApplicationRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserDataService(RoleManager<IdentityApplicationRole> roleManager,
            UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }
        public async Task<IdentityResult> CreateUser(BaseApplicationUserViewModel user, string roleName)
        {
            var userToCreate = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                FirstName = user.FirstName,
                LastName= user.LastName,
                UserName = user.EmailAddress,
                PhoneNumber = user.PhoneNumber,
                NormalizedUserName = user.EmailAddress.ToUpper(),
                Email = user.EmailAddress,
                NormalizedEmail = user.EmailAddress.ToUpper(),
                SecurityStamp = Guid.NewGuid().ToString(),
                ConcurrencyStamp = Guid.NewGuid().ToString(),
                IdNumber=  user.IdNumber.ToUpper(),
                TwoFactorEnabled = false,
                LockoutEnabled = false,
                AccessFailedCount = 0,
                IsDeleted = false,
                EntryDate = DateTime.UtcNow,
            };
            var result=await _userManager.CreateAsync(userToCreate, user.Password);
            var role = await _roleManager.FindByNameAsync(roleName:roleName);
            if (result.Succeeded) {
                result= await _userManager.AddToRoleAsync(userToCreate, role.Name);
            }
            return result;

        }
    }
}
