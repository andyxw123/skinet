using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IGenericRepository<Product> _productRepo;
        private readonly IGenericRepository<ProductBrand> _brandRepo;
        private readonly IGenericRepository<ProductType> _typeRepo;
        private readonly IMapper _mapper;

        public ProductsController(
            IGenericRepository<Product> productRepo, 
            IGenericRepository<ProductBrand> brandRepo, 
            IGenericRepository<ProductType> typeRepo,
            IMapper mapper)
        {
            _productRepo = productRepo;
            _brandRepo = brandRepo;
            _typeRepo = typeRepo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var productsFromRepo = await _productRepo.GetEntitiesWithSpec(new ProductsWithTypesAndBrandsSpec());

            var productsForReturn = _mapper.Map<ProductForReturnDto[]>(productsFromRepo);

            return Ok(productsForReturn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var productFromRepo = await _productRepo.GetEntityWithSpec(new ProductsWithTypesAndBrandsSpec(id));

            if (productFromRepo == null)
            {
                return NotFound();
            }

            var productForReturn = _mapper.Map<ProductForReturnDto>(productFromRepo);

            return Ok(productForReturn);
        }

        [HttpGet("brands")]
        public async Task<IActionResult> GetProductBrands()
        {
            var brands = await _brandRepo.ListAllAsync();
            return Ok(brands);
        }

        [HttpGet("types")]
        public async Task<IActionResult> GetProductTypes()
        {
            var types = await _typeRepo.ListAllAsync();
            return Ok(types);
        }
    }
}