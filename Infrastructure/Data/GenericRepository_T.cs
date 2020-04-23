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
    public class GenericRepository<T> : IGenericRepository<T>
        where T : BaseEntity
    {
        private readonly StoreContext _context;

        public GenericRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public async Task<T[]> GetAllAsync()
        {
            return await _context.Set<T>().ToArrayAsync();
        }
        public async Task<T> GetEntity(ISpecification<T> spec)
        {
            return await ApplySpec(spec).FirstOrDefaultAsync();
        }

        public async Task<T[]> GetEntities(ISpecification<T> spec)
        {
            return await ApplySpec(spec).ToArrayAsync();
        }
        public async Task<S[]> GetEntitiesWithSpec<S>(ISpecification<T> spec, System.Func<T[], S[]> convertResults) where S : class
        {
            return convertResults(await GetEntities(spec));
        }

        public async Task<Pagination<T>> GetEntitiesPaged(ISpecification<T> spec, IPaginationParams paginationParams)
        {
            return await GetEntitiesPaged<T>(spec, paginationParams, x => x);
        }

        public async Task<Pagination<S>> GetEntitiesPaged<S>(ISpecification<T> spec, IPaginationParams paginationParams, System.Func<T[], S[]> convertResults) where S : class
        {
            var results = convertResults(await GetEntities(spec));
            var count = await CountAsync(spec);
            var pagination = new Pagination<S>(paginationParams, count, results);
            return pagination;
        }

        private IQueryable<T> ApplySpec(ISpecification<T> spec)
        {
            return SpecEvaluator<T>.GetQuery(_context.Set<T>(), spec);
        }

        public async Task<int> CountAsync(ISpecification<T> spec)
        {
            return await SpecEvaluator<T>.GetQuery(_context.Set<T>(), spec, applyCritieriaOnly:true).CountAsync();
        }
    }
}