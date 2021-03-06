using System;
using System.Linq.Expressions;
using Core.Entities;
using Core.Interfaces;

namespace Core.Specifications.Products
{
    public class ProductsSearchSpec : BaseSpecification<Product>
    {
        public ProductsSearchSpec()
        {
            AddIncludes(
                x => x.ProductType,
                x => x.ProductBrand);
        }

        public ProductsSearchSpec(int id)
            : this()
        {
            this.AddCriteria(x => x.Id == id);
        }

        public ProductsSearchSpec(ProductsSearchParams productParams)
           : this()
        {
            if (productParams == null)
            {
                return;
            }

            if (productParams.BrandId.HasValue)
            {
                AddCriteria(x => x.ProductBrandId == productParams.BrandId);
            }

            if (productParams.TypeId.HasValue)
            {
                AddCriteria(x => x.ProductTypeId == productParams.TypeId);
            }

            if (productParams.NameSearch != null)
            {
                AddCriteria(x => x.Name.ToLower().Contains(productParams.NameSearch));
            }

            switch (productParams.Sort)
            {
                case "namedesc":
                    AddOrderByDescending(x => x.Name);
                    break;
                case "priceasc":
                    AddOrderBy(x => x.Price);
                    break;
                case "pricedesc":
                    AddOrderByDescending(x => x.Price);
                    break;
                default:
                    AddOrderBy(x => x.Name);
                    break;
            }

            ApplyPaging(productParams);
        }

    }
}