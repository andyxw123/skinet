import { Component, OnInit } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'SkiNet';

  constructor(public themeService: ThemeService, private basketService: BasketService) {}

  ngOnInit(): void {
    this.themeService.loadTheme();

    this.basketService.initBasket();
  }
}

