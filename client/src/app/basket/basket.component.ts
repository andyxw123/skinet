import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket.service';
import { Observable } from 'rxjs';
import { IBasket } from '../shared/models/i-basket';
import { IBasketItem } from '../shared/models/i-basket-item';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
})
export class BasketComponent implements OnInit {
  constructor(private basketService: BasketService, private bcService: BreadcrumbService) {}
  basket$: Observable<IBasket>;

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }

  changeItemQuantity(item: IBasketItem, amount: number) {
    if (item && item.quantity + amount > 0) {
      this.basketService.changeItemQuantity(item.id, amount);
    }
  }

  removeItem(item: IBasketItem) {
    this.basketService.removeItem(item.id);
  }

  calcTotalPrice(basket: IBasket) {
    return this.basketService.calcBasketTotalPrice(basket);
  }
}

