import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutService } from '../../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { IBasket } from 'src/app/shared/models/i-basket';
import { IOrderForCreate } from 'src/app/shared/models/i-order';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm: FormGroup;

  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  submitOrder() {
    const basket = this.basketService.getBasketSourceValue();
    const orderForCreate = this.getOrderForCreate(basket);

    this.checkoutService.createOrder$(orderForCreate).subscribe(
      (order) => {
        this.toast.success('Order created successfully');
        this.basketService.resetBasket();
        const navigationExtras: NavigationExtras = { state: order };
        this.router.navigate(['checkout/success'], navigationExtras);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getOrderForCreate(basket: IBasket): IOrderForCreate {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm.deliveryMethodId')
        .value,
      shipToAddress: this.checkoutForm.get('addressForm').value,
    };
  }
}
