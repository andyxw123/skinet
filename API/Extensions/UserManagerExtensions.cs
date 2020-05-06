using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System;

namespace API.Extensions
{
    public static class UserManagerExtensions
    {
        public static async Task<AppUser> FindByEmailWithIncludesAsync(this UserManager<AppUser> source, string email, params Expression<Func<AppUser, object>>[] includes)
        {
            var query = source.Users;

            query = includes.Aggregate(query, (currentQuery, include) => currentQuery.Include(include));

            return await query.SingleOrDefaultAsync(x => x.Email == email);
        }
    }
}