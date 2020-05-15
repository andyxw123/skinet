import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutService } from '../../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { IBasket } from 'src/app/shared/models/i-basket';
import { IOrderForCreate } from 'src/app/shared/models/i-order';
import { Router, NavigationExtras } from '@angular/router';

declare var Stripe;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm: FormGroup;
  isBusy = false;

  // Stripe interaction
  @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement: ElementRef;
  @ViewChild('cardCvc', { static: true }) cardCvcElement: ElementRef;
  stripeJS: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  isCardNumberComplete: any;
  isCardExpiryComplete: any;
  isCardCvcComplete: any;
  cardErrorMessage: any;
  cardHandler = this.onCardInputChange.bind(this);

  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.stripeJS = Stripe('pk_test_QjwBxG88mUdC3ml2uMcsKXTN00LkCowGg5'); // Publishable key from the Stripe Dashboard
    const elements = this.stripeJS.elements();

    // Mount the Strip input elements
    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);

    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy(): void {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  // {error} param - this is called "de-structuring". The onChange(..) method will rceive an object that includes an error field
  // which is all we are interested in. Putting the field name in curly braces will mean that this is the value that
  // the method will receive, rather than the whole parent object that contains it
  // onCardInputChange({ error }) {
  onCardInputChange(event) {
    switch (event.elementType) {
      case 'cardNumber':
        this.isCardNumberComplete = event.complete;
        break;
      case 'cardExpiry':
        this.isCardExpiryComplete = event.complete;
        break;
      case 'cardCvc':
        this.isCardCvcComplete = event.complete;
        break;
    }

    // Error message from Stripe
    this.cardErrorMessage = event.error ? event.error.message : null;
  }

  canSubmitOrder() {
    return this.checkoutForm.get('paymentForm.nameOnCard').valid
      && this.isCardNumberComplete && this.isCardExpiryComplete && this.isCardCvcComplete;
  }

  // An async method will await completion of all promises before moving onto the next piece of logic
  async submitOrder() {
    this.isBusy = true;

    const basket = this.basketService.getBasketSourceValue();

    try {
      // Await completion of the following promises - avoids nesting logic within .subscribe(() => ...) and .then(() => ...) etc

      // The createOrder(..) method changes an observable to a promise... this.checkoutService.createOrder$(..).toPromise();
      const createdOrder = await this.createOrder(basket);
      // The call to this.stripeJS.confirmCardPayment(..) returns a promise
      const paymentResult = await this.confirmPaymentWithStripe(basket);

      // Once both the abopve promises have completed the following can be executed (if all ok)
      if (paymentResult.paymentIntent) {
        // Payment Successful
        this.basketService.deleteBasket(basket);
        const navigationExtras: NavigationExtras = { state: createdOrder };
        this.router.navigate(['checkout/success'], navigationExtras);
      } else {
        this.toast.error(paymentResult.error.message);
      }
    } catch (error) {
      // Handle errors here rather than having individual error handling for each promise
      console.log(error);
    } finally {
      this.isBusy = false;
    }
  }

  private getOrderForCreate(basket: IBasket): IOrderForCreate {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm.deliveryMethodId').value,
      shipToAddress: this.checkoutForm.get('addressForm').value,
    };
  }

  private async createOrder(basket: IBasket) {
    const orderForCreate = this.getOrderForCreate(basket);

    return this.checkoutService.createOrder$(orderForCreate).toPromise();
  }

  private async confirmPaymentWithStripe(basket: IBasket) {
    return this.stripeJS.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber, // Only need to set one of the stripe card values
        billing_details: {
          name: this.checkoutForm.get('paymentForm.nameOnCard').value,
        },
      },
    });
  }
}
