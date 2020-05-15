import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccountService } from 'src/app/account/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent implements OnInit {
  @Input() checkoutForm: FormGroup;

  constructor(private accountService: AccountService, private toast: ToastrService) { }

  ngOnInit(): void {
  }

  saveUserAddress() {
    this.accountService.updateUserAddress$(this.checkoutForm.get('addressForm').value).subscribe(address => {
        this.toast.success('Address updated');

        // Reset the form with the returned address.
        /// Also marks the form as pristine so the "Save As Default" button becomes disabled.
        this.checkoutForm.get('addressForm').reset(address);
    }, error => {
      console.log(error);
    });
  }

}
