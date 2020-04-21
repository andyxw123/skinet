using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpec : BaseSpecification<Product>
    {
        public ProductsWithTypesAndBrandsSpec()
        {
            Include(
                x => x.ProductType,
                x => x.ProductBrand);
        }

        public ProductsWithTypesAndBrandsSpec(int id)
            : this()
        {
            this.Criteria = x => x.Id == id;
        }

    }
}