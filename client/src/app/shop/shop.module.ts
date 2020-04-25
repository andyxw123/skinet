import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ShopComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,

    SharedModule
  ],
  exports: [
    ShopComponent
  ]
})
export class ShopModule { }
