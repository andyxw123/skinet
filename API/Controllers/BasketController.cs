using System.Threading.Tasks;
using Core.Entities.Cache;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basketRepo;
        public BasketController(IBasketRepository basketRepo)
        {
            _basketRepo = basketRepo;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id) {
            var basket = await _basketRepo.GetBasketAsync(id);

            return Ok(basket ?? new CustomerBasket(id));
        }

        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasket basket)
        {
            return await _basketRepo.UpdateBasketAsync(basket);
        }

        [HttpDelete]
        public async Task<ActionResult<bool>> DeleteBasket(string id) 
        {
            return await _basketRepo.DeleteBasketAsync(id);
        }
    }
}