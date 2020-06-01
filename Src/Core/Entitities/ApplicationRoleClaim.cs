using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entitities
{
    public class ApplicationRoleClaim : IdentityRoleClaim<Guid>
    {
        public virtual IdentityApplicationRole Role { get; set; }
    }
}
