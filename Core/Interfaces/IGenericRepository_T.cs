using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Classes;
using Core.Entities;
using Core.Specifications;

namespace Core.Interfaces
{
    public interface IGenericRepository<T>
        where T : BaseEntity
    {
         Task<T> GetByIdAsync(int id);

         Task<T[]> GetAllAsync();

         Task<T> GetEntity(ISpecification<T> spec);

         Task<T[]> GetEntities(ISpecification<T> spec);

         Task<Pagination<T>> GetEntitiesPaged(ISpecification<T> spec, IPaginationParams paginationParams);

         Task<Pagination<S>> GetEntitiesPaged<S>(ISpecification<T> spec, IPaginationParams paginationParams, Func<T[], S[]> convertResults) where S : class;

         Task<int> CountAsync(ISpecification<T> spec);
    }
}