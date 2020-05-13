import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CheckoutService } from '../../checkout.service';
import { IDeliveryMethod } from 'src/app/shared/models/i-delivery-method';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss'],
})
export class CheckoutDeliveryComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  deliveryMethods: IDeliveryMethod[] = [];

  constructor(
    private checkoutService: CheckoutService,
    private basketService: BasketService
  ) {}

  ngOnInit(): void {
    this.getDeliveryMethods();
    this.setShippingPrice(null);
  }

  getDeliveryMethods() {
    this.checkoutService.getDeliveryMethods$().subscribe(
      (response) => {
        this.deliveryMethods = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.basketService.setShippingPrice(deliveryMethod);
  }
}
