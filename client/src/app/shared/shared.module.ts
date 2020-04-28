import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { PagerComponent } from './components/pager/pager.component';
import { PagerTextComponent } from './components/pager-text/pager-text.component';



@NgModule({
  declarations: [
    PagerComponent,
    PagerTextComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
  ],
  exports: [
    PagerComponent,
    PagerTextComponent,
  ]
})
export class SharedModule { }
