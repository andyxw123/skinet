using System.Threading.Tasks;
using System.Linq;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsyc(UserManager<AppUser> userManager)
        {
            // The UserManager is used to interact with the identity DB
            if (!userManager.Users.Any())
            {
                var user = new AppUser()
                {
                    DisplayName = "Bob",
                    Email = "bob@test.com",
                    UserName = "bob@test.com",
                    Address = new AppUserAddress
                    {
                        FirstName = "Bob",
                        LastName = "Axelrod",
                        Street = "10 The Street",
                        City = "New York",
                        State = "NY",
                        Zipcode = "90210"
                    }
                };

                //Password needs to be complex (1+ uppercase, 1+ lowercase, 1+ number, 1+ symbol)
                await userManager.CreateAsync(user, "Password1!");
            }
        }
    }
}