using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Infrastructure.BaseViewModel
{
    public class BaseApplicationUserViewModel
    {
        public Guid Id { get; set; }
        [RegularExpression("^.*[a-z0-9._@-]{5,16}$")]
        public string Username { get; set; }
        public string Password { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        [Required]
        public string FullName { get; set; }
        public string MobileNo { get; set; }

        [EmailAddress]
        public string EmailAddress { get; set; }
        public string Role { get; set; }
        public string RoleName { get; set; }
        public Guid? RoleId { get; set; }
    }
}
