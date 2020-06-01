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
        public string FullName { get; set; }

        [StringLength(4)]
        public string MembershipID { get; set; }

        public bool? IsActive { get; set; }

        public bool? IsDeleted { get; set; }

        [StringLength(100)]
        public string Designation { get; set; }

        public Guid? SignatureFileId { get; set; }

        public int? ZoneInfoId { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime EntryDate { get; set; }

        public Guid? EntryBy { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? LastLoginDate { get; set; }

        public virtual ICollection<ApplicationUserClaim> Claims { get; set; }
        public virtual ICollection<ApplicationUserLogin> Logins { get; set; }
        public virtual ICollection<ApplicationUserToken> Tokens { get; set; }
        public virtual ICollection<AspNetUserRole> UserRoles { get; set; }
    }
}
