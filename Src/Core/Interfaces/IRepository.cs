using Core.Entitities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IRepository
    {
        Task<List<TEntity>> List<TEntity>() where TEntity : BaseEntity;

        Task Add<TEntity>(TEntity entity) where TEntity : BaseEntity;

        Task Add<TEntity>(List<TEntity> entity) where TEntity : BaseEntity;

        Task Delete<TEntity>(TEntity entity) where TEntity : BaseEntity;
        Task Delete<TEntity>(List<TEntity> entity) where TEntity : BaseEntity;

        Task Update<TEntity>(List<TEntity> entity) where TEntity : BaseEntity;

        Task Update<TEntity>(TEntity entity) where TEntity : BaseEntity;

        IQueryable<TEntity> Query<TEntity>(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null) where TEntity : BaseEntity;

        IQueryable<TEntity> Query<TEntity>() where TEntity : class;
    }
}
