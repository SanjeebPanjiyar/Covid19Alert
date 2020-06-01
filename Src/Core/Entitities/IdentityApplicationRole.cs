using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Core.Entitities
{
    public class IdentityApplicationRole : IdentityRole<Guid>
    {
        public bool Active { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime EntryDate { get; set; }

        public bool? IsAdmin { get; set; }

        public bool? IsMember { get; set; }

        public virtual ICollection<AspNetUserRole> UserRoles { get; set; }
        public virtual ICollection<ApplicationRoleClaim> RoleClaims { get; set; }
    }
}
