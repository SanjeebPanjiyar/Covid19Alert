using Core.Entities;
using Core.Entitities;
using Core.Interfaces;
using NetTopologySuite.Geometries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.UserService
{
    public class UserLocationService : IUserLocationService
    {
        private readonly IRepository _repository;

        private Point getLocation(double latitude,double longitude) => new Point(longitude, latitude){ SRID = 4326 };
        

        public UserLocationService(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<int> GetCountNearbyLocationAndSetLocation(Guid userid, double latitude, double longitude)
        {
            var location = _repository.Query<UserLocation>(x=>x.UserId.Equals(userid)).FirstOrDefault();

            var currentLocation = getLocation(latitude, longitude);
            if (location == null)
            {
                location = new UserLocation();
                location.Location = currentLocation;
                location.UserId = userid;
                location.LastUpdateTime = DateTime.Now;
                await _repository.Add(location);
            }
            else
            {
                location.Location = currentLocation;
                location.UserId = userid;
                location.LastUpdateTime = DateTime.Now;
                await _repository.Update(location);
            }

            var userIDs = _repository.Query<UserLocation>(x => !x.UserId.Equals(userid) && x.Location.IsWithinDistance(currentLocation, 2)).Select(x => x.UserId);
            var  users= _repository.Query<ApplicationUser>().Where(x=> userIDs.Contains(x.Id));
            var count = users.Count(x => x.MarkAsCovid19);
            return count;
        }
    }
}
