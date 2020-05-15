import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private basketService: BasketService
  ) {}

  ngOnInit(): void {
    this.createCheckoutForm();
    this.populateAddressForm();
    this.populateDeliveryForm();
  }

  createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zipcode: [null, Validators.required],
      }),
      deliveryForm: this.fb.group({
        deliveryMethodId: [null, Validators.required],
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required],
      }),
    });
  }

  populateAddressForm() {
    this.accountService.getUserAddress$().subscribe(
      (r) => {
        if (r) {
          // To populate the form, can use either...
          //   .setValue(..) - object must contain all form values; or
          //   .patchValue(..) - object can contain any number of form values
          this.checkoutForm.get('addressForm').patchValue(r);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  populateDeliveryForm() {
    const basket = this.basketService.getBasketSourceValue();
    if (basket.deliveryMethodId) {
      // Need to cast the value to a string otherwise the radio button won't be selected in the UI
      this.checkoutForm
        .get('deliveryForm.deliveryMethodId')
        .patchValue(
          basket.deliveryMethodId ? basket.deliveryMethodId.toString() : null
        );
    }
  }
}
