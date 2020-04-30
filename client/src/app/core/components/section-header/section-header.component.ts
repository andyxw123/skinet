import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Breadcrumb } from 'xng-breadcrumb/lib/breadcrumb';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss'],
})
export class SectionHeaderComponent implements OnInit {
  breadcrumbs$: Observable<Breadcrumb[]>;
  defaultTitle?: string;

  constructor(private titleService: Title, private bcService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbs$ = this.bcService.breadcrumbs$;
  }

  getBreadcrumbFromView(breadcrumb: Breadcrumb, breadcrumbIndex: number) {
    const label = breadcrumb ? breadcrumb.label : null;
    this.setBrowserTitle(breadcrumbIndex > 0 ? label : null);
  }

  setBrowserTitle(title?: string) {
    if (!this.defaultTitle) {
      this.defaultTitle = this.titleService.getTitle();
    }

    if (title) {
      this.titleService.setTitle(`${this.defaultTitle} | ${title}`);
    }
    else {
      this.titleService.setTitle(this.defaultTitle);
    }
  }

}
