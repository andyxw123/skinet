import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../../shared/models/i-product';
import { ShopService } from '../../shop.service';
import { ProductFilters } from '../../models/product-filters';
import { PaginationParams } from '../../../shared/models/pagination-params';
import { Pagination } from '../../../shared/models/pagination-T';
import { INamedItem } from '../../../shared/models/i-named-item';
import { ISortOption } from '../../../shared/models/i-sort-option';
import { List } from 'linqts';

@Component({
  selector: 'app-shop',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss'],
})
export class ProductSearchComponent implements OnInit {
  productsFilter =  new ProductFilters();
  pagingParams = new PaginationParams();
  pagedProducts: Pagination<IProduct>;
  productTypes: INamedItem[];
  productBrands: INamedItem[];
  defaultPageSize = 6;

  sortOptions: ISortOption[] = [
    { value: 'nameAsc', display: 'Name A-Z' },
    { value: 'nameDesc', display: 'Name Z-A' },
    { value: 'priceAsc', display: 'Lowest Price' },
    { value: 'priceDesc', display: 'Highest Price' },
  ];

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.pagingParams.sort = this.sortOptions[0].value;
    this.pagingParams.pageSize = this.defaultPageSize;
    this.getProducts();
    this.getProductTypes();
    this.getProductBrands();
  }

  resetFilters() {
    this.productsFilter = new ProductFilters();
    this.getProducts();
  }

  getProducts(resetPageIndex = true) {
    if (resetPageIndex) {
      this.pagingParams.pageIndex = 1;
    }

    this.shopService
      .getProducts$(this.productsFilter, this.pagingParams)
      .subscribe(
        (pagedData) => {
          this.pagedProducts = pagedData;
        },
        (error) => console.log(error)
      );
  }

  getProductTypes() {
    this.shopService.getProductTypes$().subscribe(
      (data) => {
        data = new List<INamedItem>(data).OrderBy(x => x.name).ToArray();
        this.productTypes = [{ id: undefined, name: 'All'}, ...data];   // ... is a array "spread"

      },
      (error) => console.log(error)
    );
  }

  getProductBrands() {
    this.shopService.getProductBrands$().subscribe(
      (data) => {
        this.productBrands = new List<INamedItem>(data).OrderBy(x => x.name).ToArray();
      },
      (error) => console.log(error)
    );
  }

  onProductTypeSelected(id: number) {
    this.productsFilter.typeId = id;
    this.getProducts();
  }
}
