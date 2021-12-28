using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Infrastructure.BaseViewModel
{
    public class BaseApplicationUserViewModel
    {
        public Guid Id { get; set; }
        [Required]
        public string Password { get; set; }
        public bool? IsDeleted { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        [EmailAddress]
        public string EmailAddress { get; set; }
        [Required]
        public string IdNumber { get; set; }
        public string Role { get; set; }
        public string RoleName { get; set; }
        public Guid? RoleId { get; set; }
        public bool ConsentGiven { get; set; }

        public bool CovidStatus { get; set; }
    }
}
