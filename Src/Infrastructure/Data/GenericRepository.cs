using Core;
using Core.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace Infrastructure.Data
{
    public class GenericRepository : IRepository
    {
        private readonly AppDbContext _dbContext;

        public GenericRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
            _dbContext.ChangeTracker.AutoDetectChangesEnabled = false;
        }

        public List<TEntity> List<TEntity>() where TEntity : BaseEntity
        {
            return _dbContext.Set<TEntity>().ToList();
        }

        public void Add<TEntity>(TEntity entity) where TEntity : BaseEntity
        {
            _dbContext.Set<TEntity>().Add(entity);
            _dbContext.SaveChanges();
        }

        public void Add<TEntity>(List<TEntity> entity) where TEntity : BaseEntity
        {
            _dbContext.Set<TEntity>().AddRange(entity);
            _dbContext.SaveChanges();
        }

        public void Delete<TEntity>(TEntity entity) where TEntity : BaseEntity
        {
            _dbContext.Set<TEntity>().Remove(entity);
            _dbContext.SaveChanges();
        }
        public void Delete<TEntity>(List<TEntity> entity) where TEntity : BaseEntity
        {
            _dbContext.Set<TEntity>().RemoveRange(entity);
            _dbContext.SaveChanges();
        }

        public void Update<TEntity>(List<TEntity> entity) where TEntity : BaseEntity
        {
            _dbContext.Set<TEntity>().UpdateRange(entity);
            _dbContext.SaveChanges();
        }

        public void Update<TEntity>(TEntity entity) where TEntity : BaseEntity
        {
            _dbContext.Entry(entity).State = EntityState.Modified;
            _dbContext.SaveChanges();
        }


        public List<TEntity> Filter<TEntity>(Func<TEntity, bool> predicate) where TEntity : BaseEntity
        {
            return _dbContext.Set<TEntity>().Where(predicate).ToList();
        }

        public TEntity FirstOrDefault<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : BaseEntity
        {
            IQueryable<TEntity> query = _dbContext.Set<TEntity>();
            query = query.Where(predicate);

            return query.FirstOrDefault();
        }

        public TEntity GetLastItem<TEntity>(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null) where TEntity : BaseEntity
        {
            IQueryable<TEntity> query = _dbContext.Set<TEntity>();

            if (filter != null)
                query = query.Where(filter);

            if (orderBy != null)
                query = orderBy(query);

            return query.FirstOrDefault();
        }

        public bool Any<TEntity>(Func<TEntity, bool> predicate) where TEntity : BaseEntity
        {
            return _dbContext.Set<TEntity>().Any(predicate);
        }

        public virtual IQueryable<TEntity> Query<TEntity>(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null) where TEntity : BaseEntity
        {
            IQueryable<TEntity> query = _dbContext.Set<TEntity>();

            if (filter != null)
                query = query.Where(filter);

            if (orderBy != null)
                query = orderBy(query);

            return query;
        }

        private bool _disposed;

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _dbContext.Dispose();
                }
            }
            this._disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public void AddWithoutSaveChanges<TEntity>(TEntity entity) where TEntity : BaseEntity
        {
            _dbContext.Set<TEntity>().Add(entity);
        }

        public void AddWithoutSaveChanges<TEntity>(List<TEntity> entities) where TEntity : BaseEntity
        {
            _dbContext.Set<TEntity>().AddRange(entities);
        }

        public void UpdateWithoutSaveChanges<TEntity>(TEntity entity) where TEntity : BaseEntity
        {
            _dbContext.Entry(entity).State = EntityState.Modified;
        }

        public void DeleteWithoutSaveChanges<TEntity>(List<TEntity> entity) where TEntity : BaseEntity
        {
            _dbContext.Set<TEntity>().RemoveRange(entity);
        }

        public void DeleteWithoutSaveChanges<TEntity>(TEntity entity) where TEntity : BaseEntity
        {
            _dbContext.Set<TEntity>().Remove(entity);
        }

        public void SaveChanges()
        {
            _dbContext.SaveChanges();
        }

        public virtual IQueryable<TEntity> ExecuteSql<TEntity>(string sql, params object[] parameters) where TEntity : class
        {
            return _dbContext.Set<TEntity>().FromSqlRaw(sql, parameters);
        }

        public virtual dynamic ExecuteStoredProcedure(string storedProcName)
        {
            //using (var connection = new SqlConnection(_secrets.default_connection_string))
            //{
            //    try
            //    {
            //        connection.Open();
            //        var cmd = new SqlCommand($"exec {storedProcName}", connection);
            //        var val = cmd.ExecuteScalar();
            //        if (val != null)
            //        {
            //            return val;
            //        }
            //    }
            //    catch
            //    {

            //    }
            //    finally
            //    {
            //        connection.Close();
            //        connection.Dispose();
            //    }
            //}
            throw new Exception("Stored proceedure not implemented");
        }

        public virtual DataSet ExecuteStoredProcedure(string storedProcName, SqlParameter[] parameters)
        {
            DataSet ds = new DataSet();

            //using (var connection = new SqlConnection(_secrets.default_connection_string))
            //{
            //    try
            //    {
            //        connection.Open();
            //        var cmd = new SqlCommand(storedProcName, connection);
            //        cmd.CommandType = CommandType.StoredProcedure;
            //        cmd.Parameters.AddRange(parameters);
            //        SqlDataAdapter ad = new SqlDataAdapter(cmd);
            //        ad.Fill(ds);
            //    }
            //    catch (Exception ex)
            //    {
            //        var r = ex.Message;
            //    }
            //    finally
            //    {
            //        connection.Close();
            //        connection.Dispose();
            //    }
            //}
            //return ds;
            throw new Exception("Stored proceedure not implemented");
        }

        public IDbContextTransaction AddWithTransaction<TEntity>(List<TEntity> entity) where TEntity : BaseEntity
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                _dbContext.Set<TEntity>().AddRange(entity);
                _dbContext.SaveChanges();

                transaction.Commit();

                return transaction;
            }
        }

        public IDbContextTransaction UpdateWithTransaction<TEntity>(TEntity entity) where TEntity : BaseEntity
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                _dbContext.Entry(entity).State = EntityState.Modified;
                _dbContext.SaveChanges();

                transaction.Commit();

                return transaction;
            }
        }

        public IDbContextTransaction DeleteWithTransaction<TEntity>(List<TEntity> entity) where TEntity : BaseEntity
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                _dbContext.Set<TEntity>().RemoveRange(entity);
                _dbContext.SaveChanges();

                transaction.Commit();

                return transaction;
            }
        }

        public void AddWithoutBaseEntity<TEntity>(TEntity entity) where TEntity : class
        {
            _dbContext.Set<TEntity>().Add(entity);
        }

        public TEntity FirstOrDefaultWithoutBaseEntity<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : class
        {
            IQueryable<TEntity> query = _dbContext.Set<TEntity>();
            query = query.Where(predicate);

            return query.FirstOrDefault();
        }

        public IQueryable<TEntity> Query<TEntity>() where TEntity : class
        => _dbContext.Set<TEntity>();
    }
}
