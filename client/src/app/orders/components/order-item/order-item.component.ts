import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../orders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrder } from 'src/app/shared/models/i-order';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
})
export class OrderItemComponent implements OnInit {
  order: IOrder;

  constructor(
    private orderService: OrdersService,
    private router: Router,
    private route: ActivatedRoute,
    private bcService: BreadcrumbService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation && navigation.extras && navigation.extras.state;

    if (state) {
      this.setOrder(state as IOrder);
    }
  }

  ngOnInit(): void {
    if (!this.order) {
      this.getOrder();
    }
  }

  getOrder() {
    this.bcService.set('@orderDetails', 'Loading...');
    const id = +this.route.snapshot.params.id;
    this.orderService.getOrder$(id).subscribe(
      (r) => {
        this.setOrder(r);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setOrder(order: IOrder) {
    this.order = order;
    if (order) {
      this.bcService.set('@orderDetails', `Order # ${order.id} - ${order.status}`);
    }
  }
}
