import { Component, OnInit } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { BasketService } from './basket/basket.service';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'SkiNet';

  constructor(public themeService: ThemeService, private basketService: BasketService, private accountService: AccountService) {}

  ngOnInit(): void {
    this.themeService.loadTheme();

    this.basketService.initBasket();

    this.accountService.initUserLogIn();
  }
}

