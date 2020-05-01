import { Component, OnInit, Inject } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'SkiNet';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.loadTheme();
  }
}

