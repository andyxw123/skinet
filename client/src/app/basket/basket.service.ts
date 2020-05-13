import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IBasket } from '../shared/models/i-basket';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProduct } from '../shared/models/i-product';
import { IBasketItem } from '../shared/models/i-basket-item';
import { Basket } from '../shared/models/basket';
import { ToastrService } from 'ngx-toastr';
import { IBasketSummary } from '../shared/models/i-basket-summary';
import { IDeliveryMethod } from '../shared/models/i-delivery-method';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  baseUrl = environment.apiUrl + 'basket/';
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();
  private basketSummarySource = new BehaviorSubject<IBasketSummary>(null);
  basketSummary$ = this.basketSummarySource.asObservable();
  shipping?: number = null;
  deliveryMethodId?: number = null;

  constructor(private http: HttpClient, private toast: ToastrService) {
  }

  getBasket$(id: string) {
    return this.http.get(this.baseUrl + `?id=${id}`).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
        this.populateBasketSummary();
      })
    );
  }

  setBasket$(basket: IBasket) {
    const setBasket$ = this.http.post(this.baseUrl, basket);

    setBasket$.subscribe(
      (response: IBasket) => {
        this.basketSource.next(basket);
        this.populateBasketSummary();
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );

    return setBasket$;
  }

  deleteBasket$(basketId: string) {
    const params = new HttpParams().append('id', basketId);

    return this.http.delete(this.baseUrl, { params });
  }

  initBasket() {
    const basketId = localStorage.getItem('basketId');

    if (!basketId) {
      return;
    }

    this.getBasket$(basketId).subscribe(() => {
    }, error => {
      console.log(error);
    });
  }

  resetBasket() {
    this.basketSource.next(null);
    this.basketSummarySource.next(null);
    localStorage.removeItem('basketId');
  }

  getBasketSourceValue() {
    return this.basketSource.value;
  }

  createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basketId', basket.id);
    return basket;
  }

  addItemToBasket(product: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = Object.assign({ quantity }, product);
    const basket = this.getBasketSourceValue() ?? this.createBasket();

    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket$(basket).subscribe((response: IBasket) => {
        if (response) {
          this.toast.success(`${product.name} (${quantity}) added to basket`);
        }
    });
  }

  private addOrUpdateItem(
    items: IBasketItem[],
    itemToAdd: IBasketItem,
    quantity: number
  ): IBasketItem[] {
    const existingItem = items.find((x) => x.id === itemToAdd.id);

    if (!existingItem) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      existingItem.quantity += quantity;
    }

    return items;
  }


  calcBasketTotalPrice(basket: IBasket) {
    return basket.items.map(x => x.price * x.quantity).reduce((x, y) => x + y, 0);
  }

  populateBasketSummary() {
    const basket = this.getBasketSourceValue();

    const summary = {
      subtotal: basket.items.reduce((x, y) => (y.price * y.quantity) + x, 0),
      shipping: this.shipping,
      total: 0
    };

    summary.total = summary.subtotal + (summary.shipping || 0);

    this.basketSummarySource.next(summary);

    return summary;
  }

  changeItemQuantity(itemId: number, amount: number) {
    const basket = this.getBasketSourceValue();
    const item = basket.items.find(x => x.id === itemId);

    if (!item) {
      return;
    }

    item.quantity += amount;

    if (item.quantity > 0) {
        this.setBasket$(basket);
    } else {
        this.removeItem(itemId);
    }
  }

  removeItem(itemId: number) {
    const basket = this.getBasketSourceValue();
    const item = basket.items.find(x => x.id === itemId);

    if (!item) {
      return;
    }

    basket.items.splice(basket.items.indexOf(item), 1);

    if (basket.items.length) {
      this.setBasket$(basket);
    } else {
      this.deleteBasket$(basket.id).subscribe(() => {
        localStorage.removeItem(basket.id);
      });
    }
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod ? deliveryMethod.price : null;
    this.deliveryMethodId = deliveryMethod ? deliveryMethod.id : null;
    this.populateBasketSummary();
  }
}
