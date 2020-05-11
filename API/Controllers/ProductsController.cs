using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Classes;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications.Products;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
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
        public async Task<ActionResult<ProductForReturnDto[]>> GetProducts([FromQuery] ProductsSearchParams productParams)
        {
            var spec = new ProductsSearchSpec(productParams);

            var productsForReturnPaged = await _productRepo.GetEntitiesPagedAsync<ProductForReturnDto>(spec, productParams, (products) => _mapper.Map<ProductForReturnDto[]>(products));

            Response.AddPaginationHeader(productsForReturnPaged);

            return productsForReturnPaged.Data;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)] // Swagger will pick up the schema for the ProductForReturnDto
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)] // Adds additional info to the Swagger documentation (if needed)
        public async Task<ActionResult<ProductForReturnDto>> GetProduct(int id)
        {
            var productFromRepo = await _productRepo.GetEntityAsync(new ProductsSearchSpec(id));

            if (productFromRepo == null)
            {
                return ApiResponse.NotFound();
            }

            var productForReturn = _mapper.Map<ProductForReturnDto>(productFromRepo);

            return productForReturn;
        }

        [HttpGet("brands")]
        public async Task<ActionResult<ProductBrand[]>> GetProductBrands()
        {
            var brands = await _brandRepo.GetAllAsync();
            return brands;
        }

        [HttpGet("types")]
        public async Task<ActionResult<ProductType[]>> GetProductTypes()
        {
            var types = await _typeRepo.GetAllAsync();
            return types;
        }
    }
}