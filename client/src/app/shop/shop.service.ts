import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IProduct } from '../shared/models/i-product';
import { environment } from 'src/environments/environment';
import { ProductFilters } from './models/product-filters';
import { IPaginationParams } from '../shared/models/i-pagination-params';
import { INamedItem } from '../shared/models/i-named-item';
import { map } from 'rxjs/operators';
import { Pagination } from '../shared/models/pagination-T';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = environment.apiUrl;
  cachedProducts: IProduct[] = [];
  cachedTypes: INamedItem[];
  cachedBrands: INamedItem[];

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
      .get<Pagination<IProduct>>(this.baseUrl + 'products', {
        params,
      })
      .pipe(
        map(response => {
          // Cache the product search results - the getProduct$(..) medthod will check this
          this.cachedProducts = response.data;

          // Object.assign(
          //   paginatedResult,
          //   JSON.parse(response.headers.get('Pagination') || null)
          // );

          return response;
        })
      );
  }

  getProduct$(id: number) {
    const product = this.cachedProducts.find(x => x.id === id);

    if (product) {
      return of(product); // This returns an Observable<Product>
    }

    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  getProductTypes$() {
    if (this.cachedTypes) {
      return of(this.cachedTypes);
    }

    return this.http.get<INamedItem[]>(this.baseUrl + 'products/types').pipe(
      map(r => {
        this.cachedTypes = r;
        return r;
      })
    );
  }

  getProductBrands$() {
    if (this.cachedBrands) {
      return of(this.cachedBrands);
    }

    return this.http.get<INamedItem[]>(this.baseUrl + 'products/brands').pipe(
      map(r => {
        this.cachedBrands = r;
        return r;
      })
    );
  }
}
