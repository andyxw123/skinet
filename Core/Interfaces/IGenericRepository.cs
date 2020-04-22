using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specifications;

namespace Core.Interfaces
{
    public interface IGenericRepository<T>
        where T : BaseEntity
    {
         Task<T> GetByIdAsync(int id);

         Task<List<T>> ListAllAsync();

         Task<T> GetEntityWithSpec(ISpecification<T> spec);

         Task<List<T>> GetEntitiesWithSpec(ISpecification<T> spec);
    }
}