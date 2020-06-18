using Core;
using Core.Entitities;
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
using System.Threading.Tasks;

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


        public async Task<List<TEntity>> List<TEntity>() where TEntity : BaseEntity
        {
            return await _dbContext.Set<TEntity>().ToListAsync();
        }

        public async Task Add<TEntity>(TEntity entity) where TEntity : BaseEntity
        {
            await _dbContext.Set<TEntity>().AddAsync(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task Add<TEntity>(List<TEntity> entity) where TEntity : BaseEntity
        {
            await _dbContext.Set<TEntity>().AddRangeAsync(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task Delete<TEntity>(TEntity entity) where TEntity : BaseEntity
        {
            _dbContext.Set<TEntity>().Remove(entity);
            await _dbContext.SaveChangesAsync();
        }
        public async Task Delete<TEntity>(List<TEntity> entity) where TEntity : BaseEntity
        {
            _dbContext.Set<TEntity>().RemoveRange(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task Update<TEntity>(List<TEntity> entity) where TEntity : BaseEntity
        {
            _dbContext.Set<TEntity>().UpdateRange(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task Update<TEntity>(TEntity entity) where TEntity : BaseEntity
        {
            _dbContext.Update(entity);
            await _dbContext.SaveChangesAsync();
        }

        public IQueryable<TEntity> Query<TEntity>(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null) where TEntity : BaseEntity
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

        public IQueryable<TEntity> Query<TEntity>() where TEntity : class
        => _dbContext.Set<TEntity>();

    }
}
