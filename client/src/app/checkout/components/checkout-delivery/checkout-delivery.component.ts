import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CheckoutService } from '../../checkout.service';
import { IDeliveryMethod } from 'src/app/shared/models/i-delivery-method';
import { BasketService } from 'src/app/basket/basket.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

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
  }

  getDeliveryMethods() {
    this.checkoutService.getDeliveryMethods$().subscribe(
      (response) => {
        this.deliveryMethods = response;

        this.onGetDeliveryMethodsDone();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onGetDeliveryMethodsDone() {
    // Using .pipe(first()) will unsubscribe immediately after completion
    this.basketService.basket$.pipe(first()).subscribe((basket) => {
      const deliveryMethod = this.deliveryMethods.find(
        (x) => x.id === basket.deliveryMethodId
      );

      if (deliveryMethod) {
        this.setShippingPrice(deliveryMethod);
      }
    });
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.basketService.setShippingPrice(deliveryMethod);
  }
}
