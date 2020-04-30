import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { PagerComponent } from './components/pager/pager.component';
import { PagerHeaderComponent } from './components/pager-header/pager-header.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ErrorSummaryComponent } from './components/error-summary/error-summary.component';

@NgModule({
  declarations: [
    PagerComponent,
    PagerHeaderComponent,
    ErrorSummaryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot(),
    ClipboardModule
  ],
  exports: [
    PagerComponent,
    PagerHeaderComponent,
    ClipboardModule,
    CarouselModule,
    ErrorSummaryComponent
  ]
})
export class SharedModule { }
