﻿using Core.Entities;
using NetTopologySuite.Geometries;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Entitities
{
    public class UserLocation : BaseEntity
    {
        public Guid UserId { get; set; }

        public Point Location { get; set; }

        public virtual ApplicationUser User { get; set; }

    }
}
