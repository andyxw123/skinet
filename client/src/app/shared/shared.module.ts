import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataPagerComponent } from './components/data-pager/data-pager.component';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  declarations: [
    DataPagerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot()
  ],
  exports: [
    DataPagerComponent
  ]
})
export class SharedModule { }
