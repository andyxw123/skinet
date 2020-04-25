import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../shared/interfaces/i-pagination';
import { IProduct } from '../shared/interfaces/i-product';
import { environment } from 'src/environments/environment';
import { ProductFilters } from './classes/product-filters';
import { PaginationParams } from '../shared/classes/pagination-params';
import { IPaginationParams } from '../shared/interfaces/i-pagination-params';
import { INamedItem } from '../shared/interfaces/i-named-item';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(filters?: ProductFilters, paging?: IPaginationParams) {
    let params = new HttpParams();

    if (paging) {
      if (paging.pageIndex > 0 && paging.pageSize > 0) {
        params = params.append('pageIndex', paging.pageIndex.toString());
        params = params.append('pageSize', paging.pageSize.toString());
      }
    }

    if (filters) {
      if (filters.typeId >= 0) {
        params = params.append('typeId', filters.typeId.toString());
      }

      if (filters.brandId >= 0) {
        params = params.append('brandId', filters.brandId.toString());
      }

      if (filters.nameSearch) {
        params = params.append('nameSearch', filters.nameSearch);
      }

      if (filters.sort) {
        params = params.append('sort', filters.sort);
      }
    }

    return this.http.get<IPagination<IProduct>>(this.baseUrl + 'products', {
      params,
    });
  }

  getProductTypes() {
    return this.http.get<INamedItem[]>(this.baseUrl + 'products/types');
  }

  getProductBrands() {
    return this.http.get<INamedItem[]>(this.baseUrl + 'products/brands');
  }
}
