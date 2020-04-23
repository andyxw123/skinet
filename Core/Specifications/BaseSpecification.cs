using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Core.Classes;
using Core.Interfaces;

namespace Core.Specifications
{
    public class BaseSpecification<T> : ISpecification<T>
    {
        public BaseSpecification()
        {
        }

        public BaseSpecification(Expression<Func<T, bool>> criteria)
        {
            AddCriteria(criteria);
        }

        public List<Expression<Func<T, bool>>> Criteria { get; } = new List<Expression<Func<T, bool>>>();

        public List<Expression<Func<T, object>>> Includes { get; } = new List<Expression<Func<T, object>>>();

        protected void AddCriteria(params Expression<Func<T, bool>>[] criteriaExpressions)
        {
            Criteria.AddRange(criteriaExpressions);
        }

        protected void AddIncludes(params Expression<Func<T, object>>[] includeExpressions)
        {
            Includes.AddRange(includeExpressions);
        }

        protected void AddOrderBy(Expression<Func<T, object>> orderByExpression)
        {
            OrderBy = orderByExpression;
        }

        protected void AddOrderByDescending(Expression<Func<T, object>> orderByDescExpression)
        {
            OrderByDescending = orderByDescExpression;
        }


        public Expression<Func<T, object>> OrderBy { get; private set; }

        public Expression<Func<T, object>> OrderByDescending { get; private set; }

        public int Take { get; private set; }
        public int Skip { get; private set; }
        public bool IsPagingEnabled { get; protected set; }

        protected void ApplyPaging(int skip, int take)
        {
            Skip = skip;
            Take = take;
            IsPagingEnabled = true;
        }

        protected void ApplyPaging(IPaginationParams paginationParams)
        {
            if (paginationParams == null)
            {
                ApplyPaging(0, 0);
                IsPagingEnabled = false;
                return;
            }
            
            ApplyPaging(paginationParams.PageSize * (paginationParams.PageIndex - 1), paginationParams.PageSize);
        }
    }
}