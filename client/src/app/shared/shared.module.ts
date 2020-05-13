import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CdkStepperModule } from '@angular/cdk/stepper';

import { PagerComponent } from './components/pager/pager.component';
import { PagerHeaderComponent } from './components/pager-header/pager-header.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ErrorSummaryComponent } from './components/error-summary/error-summary.component';
import { BasketSummaryComponent } from './components/basket-summary/basket-summary.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { BasketItemsComponent } from './components/basket-items/basket-items.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PagerComponent,
    PagerHeaderComponent,
    ErrorSummaryComponent,
    BasketSummaryComponent,
    TextInputComponent,
    StepperComponent,
    BasketItemsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot(),
    BsDropdownModule.forRoot(),
    ClipboardModule,
    ReactiveFormsModule,
    FormsModule,
    CdkStepperModule,
    RouterModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    BsDropdownModule,
    CdkStepperModule,
    RouterModule,

    PagerComponent,
    PagerHeaderComponent,
    ClipboardModule,
    CarouselModule,
    ErrorSummaryComponent,
    BasketSummaryComponent,
    BasketItemsComponent,
    TextInputComponent,
    StepperComponent,
  ]
})
export class SharedModule { }
