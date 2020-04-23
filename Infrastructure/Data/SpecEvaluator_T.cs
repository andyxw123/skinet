using System.Linq;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class SpecEvaluator<TEntity>
        where TEntity : BaseEntity
    {
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery, ISpecification<TEntity> spec, bool applyCritieriaOnly = false)
        {
            var query = inputQuery;

            query = spec.Criteria.Aggregate(query, (currentQuery, criteria) => currentQuery.Where(criteria));

            if (applyCritieriaOnly)
            {
                return query;
            }

            query = spec.Includes.Aggregate(query, (currentQuery, include) => currentQuery.Include(include));

            if (spec.OrderBy != null)
            {
                query = query.OrderBy(spec.OrderBy);
            }

            if (spec.OrderByDescending != null)
            {
                query = query.OrderByDescending(spec.OrderByDescending);
            }

            if (spec.IsPagingEnabled)
            {
                query = query.Skip(spec.Skip).Take(spec.Take);
            }

            return query;
        }
    }
}