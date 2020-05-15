import { Component, OnInit, Input } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit {
  @Input() appStepper: CdkStepper;

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
  }

  prepareForPayment() {
    this.basketService.createPaymentIntent$().subscribe(
      (basket) => {
        this.appStepper.next();
      },
      error => {
        console.log(error);
      });
  }
}
