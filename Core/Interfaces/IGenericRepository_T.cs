using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Classes;
using Core.Entities;
using Core.Specifications;

namespace Core.Interfaces
{
    public interface IGenericRepository<TEntity>
        where TEntity : BaseEntity
    {
         Task<TEntity> GetByIdAsync(int id);

         Task<TEntity[]> GetAllAsync();

         Task<TEntity> GetEntityAsync(ISpecification<TEntity> spec);

         Task<TEntity[]> GetEntitiesAsync(ISpecification<TEntity> spec);

         Task<Pagination<TEntity>> GetEntitiesPagedAsync(ISpecification<TEntity> spec, IPaginationParams paginationParams);

         Task<Pagination<S>> GetEntitiesPagedAsync<S>(ISpecification<TEntity> spec, IPaginationParams paginationParams, Func<TEntity[], S[]> convertResults) where S : class;

         Task<int> CountAsync(ISpecification<TEntity> spec);

         void Add(TEntity entity);

         void Update(TEntity entity);

         void Delete(TEntity entity);
    }
}