import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IProduct } from '../shared/models/i-product';
import { environment } from 'src/environments/environment';
import { ProductFilters } from './models/product-filters';
import { IPaginationParams } from '../shared/models/i-pagination-params';
import { INamedItem } from '../shared/models/i-named-item';
import { map } from 'rxjs/operators';
import { Pagination } from '../shared/models/pagination-T';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts$(filters?: ProductFilters, paging?: IPaginationParams) {
    let params = new HttpParams();

    if (paging) {
      if (paging.pageIndex > 0 && paging.pageSize > 0) {
        params = params.append('pageIndex', paging.pageIndex.toString());
        params = params.append('pageSize', paging.pageSize.toString());
      }

      if (paging.sort) {
        params = params.append('sort', paging.sort);
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
    }

    return this.http
      .get<IProduct[]>(this.baseUrl + 'products', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const paginatedResult = new Pagination<IProduct>();
          paginatedResult.data = response.body;

          Object.assign(
            paginatedResult,
            JSON.parse(response.headers.get('Pagination') || null)
          );

          return paginatedResult;
        })
      );
  }

  getProduct$(id: number) {
    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  getProductTypes$() {
    return this.http.get<INamedItem[]>(this.baseUrl + 'products/types');
  }

  getProductBrands$() {
    return this.http.get<INamedItem[]>(this.baseUrl + 'products/brands');
  }
}
