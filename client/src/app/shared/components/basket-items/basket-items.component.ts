import { Component, OnInit, Input } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { Observable } from 'rxjs';
import { IBasket } from '../../models/i-basket';
import { IBasketItem } from '../../models/i-basket-item';
import { IOrderItem } from '../../models/i-order';

@Component({
  selector: 'app-basket-items',
  templateUrl: './basket-items.component.html',
  styleUrls: ['./basket-items.component.scss']
})
export class BasketItemsComponent implements OnInit {
  basket$: Observable<IBasket>;
  @Input() showSummary = false;
  @Input() isReadOnly = true;
  @Input() orderItems: IBasketItem | IOrderItem[];

  constructor(private basketService: BasketService) { }

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
