using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Classes;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity>
        where TEntity : BaseEntity
    {
        private readonly StoreContext _context;

        public GenericRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<TEntity> GetByIdAsync(int id)
        {
            return await _context.Set<TEntity>().FindAsync(id);
        }

        public async Task<TEntity[]> GetAllAsync()
        {
            return await _context.Set<TEntity>().ToArrayAsync();
        }
        public async Task<TEntity> GetEntityAsync(ISpecification<TEntity> spec)
        {
            return await ApplySpec(spec).FirstOrDefaultAsync();
        }

        public async Task<TEntity[]> GetEntitiesAsync(ISpecification<TEntity> spec)
        {
            return await ApplySpec(spec).ToArrayAsync();
        }
        public async Task<S[]> GetEntitiesWithSpecAsync<S>(ISpecification<TEntity> spec, System.Func<TEntity[], S[]> convertResults) where S : class
        {
            return convertResults(await GetEntitiesAsync(spec));
        }

        public async Task<Pagination<TEntity>> GetEntitiesPagedAsync(ISpecification<TEntity> spec, IPaginationParams paginationParams)
        {
            return await GetEntitiesPagedAsync<TEntity>(spec, paginationParams, x => x);
        }

        public async Task<Pagination<T>> GetEntitiesPagedAsync<T>(ISpecification<TEntity> spec, IPaginationParams paginationParams, System.Func<TEntity[], T[]> convertResults) 
            where T : class // Type of result
        {
            var results = convertResults(await GetEntitiesAsync(spec));
            var count = await CountAsync(spec);
            var pagination = new Pagination<T>(paginationParams, count, results);
            return pagination;
        }

        private IQueryable<TEntity> ApplySpec(ISpecification<TEntity> spec)
        {
            return SpecEvaluator<TEntity>.GetQuery(_context.Set<TEntity>(), spec);
        }

        public async Task<int> CountAsync(ISpecification<TEntity> spec)
        {
            return await SpecEvaluator<TEntity>.GetQuery(_context.Set<TEntity>(), spec, applyCritieriaOnly:true).CountAsync();
        }

        public void Add(TEntity entity)
        {
            _context.Set<TEntity>().Add(entity);
        }

        public void Update(TEntity entity)
        {
            _context.Set<TEntity>().Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;
        }

        public void Delete(TEntity entity)
        {
            _context.Set<TEntity>().Remove(entity);
        }
    }
}