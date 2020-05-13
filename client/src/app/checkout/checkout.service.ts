import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IDeliveryMethod } from '../shared/models/i-delivery-method';
import { map } from 'rxjs/operators';
import { IOrderForCreate, IOrder } from '../shared/models/i-order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createOrder$(order: IOrderForCreate) {
    return this.http.post<IOrder>(this.baseUrl + 'orders', order);
  }

  getDeliveryMethods$() {
    return this.http.get<IDeliveryMethod[]>(this.baseUrl + 'orders/deliveryMethods').pipe(
      map(deliveryMethods => {
        return deliveryMethods.sort((a, b) => b.price - a.price);
      })
    );
  }


}
