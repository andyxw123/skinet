using System.Linq;
using Core.Entities;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class SpecEvaluator<TEntity>
        where TEntity : BaseEntity
    {
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery, ISpecification<TEntity> spec)
        {
            var query = inputQuery;

            if (spec.Criteria != null)
            {
                query = query.Where(spec.Criteria);
            }

            query = spec.Includes.Aggregate(query, (currentQuery, include) => currentQuery.Include(include));

            return query;
        }
    }
}