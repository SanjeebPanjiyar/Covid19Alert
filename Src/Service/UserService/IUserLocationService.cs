using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Service.UserService
{
    public interface IUserLocationService
    {
        public Task<int> GetCountNearbyLocationAndSetLocation(Guid userid, double latitude, double longitude);
    }
}
