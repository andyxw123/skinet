using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities.Cache;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IMapper _mapper;

        public BasketController(IBasketRepository basketRepo, IMapper mapper)
        {
            _basketRepo = basketRepo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id) {
            var basket = await _basketRepo.GetBasketAsync(id);

            return Ok(basket ?? new CustomerBasket(id));
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> UpdateBasket(BasketDto basketDto)
        {
            var customerBasket = _mapper.Map<CustomerBasket>(basketDto);

            var updatedBasket = await _basketRepo.UpdateBasketAsync(customerBasket);

            return _mapper.Map<BasketDto>(updatedBasket);
        }

        [HttpDelete]
        public async Task<ActionResult<bool>> DeleteBasket(string id) 
        {
            return await _basketRepo.DeleteBasketAsync(id);
        }
    }
}