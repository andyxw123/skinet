import { Component, OnInit, Input } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasketSummary } from '../../models/i-basket-summary';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {
  basketSummary$: Observable<IBasketSummary>;

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.basketSummary$ = this.basketService.basketSummary$;
  }

}
