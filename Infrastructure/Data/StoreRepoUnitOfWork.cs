using System;
using System.Collections;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data
{
    public class StoreRepoUnitOfWork : IRepositoryUnitOfWork
    {
        private readonly StoreContext _context;
        private Hashtable _repositories;

        public StoreRepoUnitOfWork(StoreContext context)
        {
            _context = context;
        }

        public async Task<int> SaveChanges()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            if (_context != null)
            {
                _context.Dispose();
            }
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            if (_repositories == null) _repositories = new Hashtable();

            var entityType = typeof(TEntity);

            if (!_repositories.ContainsKey(entityType))
            {
                var repo = new GenericRepository<TEntity>(_context);

                _repositories.Add(entityType, repo);
            }

            return (IGenericRepository<TEntity>)_repositories[entityType];
        }
    }
}