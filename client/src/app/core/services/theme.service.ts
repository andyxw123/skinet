import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { throwError } from 'rxjs';
import { BusyService } from './busy.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  themes: string[] = [
    'default',
    'cerulean',
    'cosmo',
    'cyborg',
    'darkly',
    'flatly',
    'journal',
    'litera',
    'lumen',
    'lux',
    'materia',
    'minty',
    'pulse',
    'sandstone',
    'simplex',
    'sketchy',
    'slate',
    'solar',
    'spacelab',
    'superhero',
    'united',
    'yeti',
  ];

  constructor(@Inject(DOCUMENT) private document: Document) {}

  loadTheme(theme?: string) {
    theme = (theme || '').trim().toLowerCase();

    if (this.themes.indexOf(theme) === -1) {
      theme = this.themes[0];
    }

    // Hide the body whilst the theme is being updated
    document.body.setAttribute('hidden', 'true');

    let cssThemeLink = this.document.getElementById('theme') as HTMLLinkElement;

    const docHead = this.document.getElementsByTagName('head')[0];

    if (cssThemeLink) {
      docHead.removeChild(cssThemeLink);
    }

    cssThemeLink = this.document.createElement('link');
    cssThemeLink.id = 'theme';

    cssThemeLink.rel = 'stylesheet';

    cssThemeLink.href = `${theme}.css`;

    cssThemeLink.addEventListener('load', () =>
      document.body.removeAttribute('hidden')
    );

    // Prepend to the top of the head node to ensure that it is applied before styles.css
    docHead.prepend(cssThemeLink);
  }
}
