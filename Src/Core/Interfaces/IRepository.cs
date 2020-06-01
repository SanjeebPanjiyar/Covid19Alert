using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace Core.Interfaces
{
    public interface IRepository
    {
        List<TEntity> List<TEntity>() where TEntity : BaseEntity;
        void Add<TEntity>(TEntity entity) where TEntity : BaseEntity;
        void Add<TEntity>(List<TEntity> entity) where TEntity : BaseEntity;
        void Update<TEntity>(List<TEntity> entity) where TEntity : BaseEntity;
        void Update<TEntity>(TEntity entity) where TEntity : BaseEntity;
        void Delete<TEntity>(TEntity entity) where TEntity : BaseEntity;
        void Delete<TEntity>(List<TEntity> entity) where TEntity : BaseEntity;
        List<TEntity> Filter<TEntity>(Func<TEntity, bool> predicate) where TEntity : BaseEntity;
        TEntity FirstOrDefault<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : BaseEntity;
        TEntity GetLastItem<TEntity>(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null) where TEntity : BaseEntity;
        bool Any<TEntity>(Func<TEntity, bool> predicate) where TEntity : BaseEntity;
        IQueryable<TEntity> Query<TEntity>(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null) where TEntity : BaseEntity;

        void AddWithoutSaveChanges<TEntity>(TEntity entity) where TEntity : BaseEntity;
        void AddWithoutSaveChanges<TEntity>(List<TEntity> entities) where TEntity : BaseEntity;
        void UpdateWithoutSaveChanges<TEntity>(TEntity entity) where TEntity : BaseEntity;

        void DeleteWithoutSaveChanges<TEntity>(List<TEntity> entity) where TEntity : BaseEntity;

        void DeleteWithoutSaveChanges<TEntity>(TEntity entity) where TEntity : BaseEntity;

        void SaveChanges();

        IQueryable<TEntity> ExecuteSql<TEntity>(string sql, params object[] parameters) where TEntity : class;

        dynamic ExecuteStoredProcedure(string storedProcName);
        DataSet ExecuteStoredProcedure(string storedProcName, SqlParameter[] parameters);

        IDbContextTransaction AddWithTransaction<TEntity>(List<TEntity> entity) where TEntity : BaseEntity;

        IDbContextTransaction UpdateWithTransaction<TEntity>(TEntity entity) where TEntity : BaseEntity;

        IDbContextTransaction DeleteWithTransaction<TEntity>(List<TEntity> entity) where TEntity : BaseEntity;

        TEntity FirstOrDefaultWithoutBaseEntity<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : class;

        IQueryable<TEntity> Query<TEntity>() where TEntity : class;

        void AddWithoutBaseEntity<TEntity>(TEntity entity) where TEntity : class;
    }
}
