using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;

        private readonly IMapper _mapper;

        public OrdersController(IOrderService orderService, IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderForCreateDto orderDto)
        {
            var email = HttpContext.User?.RetrieveEmail();

            var address = _mapper.Map<Address>(orderDto.ShipToAddress);

            var order = await _orderService.CreateOrderAsync(email, orderDto.DeliveryMethodId, orderDto.BasketId, address);

            if (order == null) return ApiResponse.BadRequest("Failed to create order");

            return Ok(order);
        }

        [HttpGet]
        public async Task<ActionResult<OrderForReturnDto[]>> GetOrdersForUser()
        {
            var email = HttpContext.User?.RetrieveEmail();

            var orders = await _orderService.GetOrdersForUserAsync(email);

            return _mapper.Map<OrderForReturnDto[]>(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderForReturnDto>> GetOrderByIdForUser(int id)
        {
            var email = HttpContext.User?.RetrieveEmail();

            var order = await _orderService.GetOrderByIdAsync(id, email);

             if (order == null) return ApiResponse.NotFound();

            return _mapper.Map<OrderForReturnDto>(order);
        }

        [HttpGet("deliveryMethods")]
        public async Task<ActionResult<DeliveryMethod[]>> GetDeliveryMethods()
        {
            return await _orderService.GetDeliveryMethodsAsync();
        }

    }
}