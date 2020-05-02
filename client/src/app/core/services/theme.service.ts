import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BusyService } from './busy.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentTheme?: string;
  isLoadingTheme = false;
  themes: string[] = [
    'default',
    'darkly',
    'lumen',
    'sketchy',
    'slate',
    'superhero',
    'united',
  ];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private busyService: BusyService
  ) {
    this.currentTheme = localStorage.getItem('theme');
  }

  loadTheme(theme?: string) {
    theme = (theme || this.currentTheme || '').trim().toLowerCase();

    if (this.themes.indexOf(theme) === -1) {
      theme = this.themes[0];
    }

    const themeCss = `${theme}.css`;

    let cssThemeLink = this.document.getElementById('theme') as HTMLLinkElement;

    if (cssThemeLink && cssThemeLink.href === themeCss) {
      return;
    }

    this.setIsLoadingTheme(true);

    this.currentTheme = theme;
    localStorage.setItem('theme', theme);

    const docHead = this.document.getElementsByTagName('head')[0];

    // Remove existing theme's css
    if (cssThemeLink) {
      docHead.removeChild(cssThemeLink);
    }

    cssThemeLink = this.document.createElement('link');
    cssThemeLink.id = 'theme';

    cssThemeLink.rel = 'stylesheet';

    cssThemeLink.href = themeCss;

    cssThemeLink.addEventListener('load', () => {
      document.body.removeAttribute('hidden');
      this.setIsLoadingTheme(false);
    });

    // Prepend to the top of the head node to ensure that it is applied before styles.css
    docHead.prepend(cssThemeLink);
  }

  setIsLoadingTheme(isLoading: boolean) {
    this.isLoadingTheme = isLoading;
    isLoading ? this.busyService.busy() : this.busyService.idle();
  }
}
