import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { PagerComponent } from './components/pager/pager.component';
import { PagerTextComponent } from './components/pager-text/pager-text.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ErrorSummaryComponent } from './components/error-summary/error-summary.component';

@NgModule({
  declarations: [
    PagerComponent,
    PagerTextComponent,
    ErrorSummaryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    ClipboardModule
  ],
  exports: [
    PagerComponent,
    PagerTextComponent,
    ClipboardModule,
    ErrorSummaryComponent
  ]
})
export class SharedModule { }
