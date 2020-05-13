import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../orders.service';
import { IOrder } from 'src/app/shared/models/i-order';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  constructor(private ordersService: OrdersService) { }
  orders: IOrder[];

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.ordersService.getOrders$().subscribe(r => {
      this.orders = r;
    }, error => {
      console.log(error);
    });
  }
}
