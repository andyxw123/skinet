import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/interfaces/i-product';
import { ShopService } from './shop.service';
import { ProductFilters } from './classes/product-filters';
import { PaginationParams } from '../shared/classes/pagination-params';
import { ISelectItem } from '../shared/interfaces/i-select-item';
import { Pagination } from '../shared/classes/pagination';
import { INamedItem } from '../shared/interfaces/i-named-item';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  productsFilter: ProductFilters;
  pagingParams = new PaginationParams();
  pagedProducts =  new Pagination<IProduct>();
  productTypes: INamedItem[] = [];
  productBrands: INamedItem[] = [];

  sortOptions: ISelectItem<string>[] = [
    { value: 'nameAsc', display: 'Name Asc' },
    { value: 'nameDesc', display: 'Name Desc' },
    { value: 'priceAsc', display: 'Price Asc' },
    { value: 'priceDesc', display: 'Price Desc' }
  ];

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.resetFilters();
    this.loadProductTypes();
    this.loadProductBrands();
  }

  loadProducts() {
    this.shopService.getProducts(this.productsFilter, this.pagingParams).subscribe((pagedData) => {
      this.pagedProducts = pagedData;
    });
  }

  loadProductTypes(){
    this.shopService.getProductTypes().subscribe(data => {
      this.productTypes = data;
    });
  }

  loadProductBrands(){
    this.shopService.getProductBrands().subscribe(data => {
      this.productBrands = data;
    });
  }

  resetFilters() {
    this.productsFilter = new ProductFilters();
    this.productsFilter.sort = this.sortOptions[0].value;
  }

  productsPageChanged(e: any) {
    this.pagingParams.pageIndex = e.page;
    this.loadProducts();
  }

  productSelect(e: any) {
    console.log(e);
  }
}
