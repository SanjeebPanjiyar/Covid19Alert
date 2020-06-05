using Core.Entitities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Core.Entities
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        [StringLength(50)]
        public string FirstName { get; set; }
        [StringLength(50)]
        public string LastName { get; set; }
        public string IdNumber { get; set; }
        public bool? IsDeleted { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime EntryDate { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? LastLoginDate { get; set; }
        public virtual ICollection<AspNetUserRole> UserRoles { get; set; }
    }
}
