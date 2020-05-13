import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OrderItemComponent } from './components/order-item/order-item.component';
import { OrderListComponent } from './components/order-list/order-list.component';

const routes: Routes = [
  {
    path: '',
    component: OrderListComponent
  },
  {
    path: ':id',
    component: OrderItemComponent,
    data: { breadcrumb: { alias: 'orderDetails' } },
  },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class OrdersRoutingModule { }
