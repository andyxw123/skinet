import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AsyncValidatorFn,
} from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { timer, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errors: string[];

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      displayName: [null, [Validators.required]],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
        ],
        [this.validateEmailNotTaken()],
      ],
      password: [null, [Validators.required]],
    });
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return (control) => {
      // Wait half a second before calling server
      return timer(500).pipe(
        // switchMap: Map to observable, complete previous inner observable, emit values.
        // http://learnrxjs.io/learn-rxjs/operators/transformation/switchmap
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }
          return this.accountService.checkEmailExists$(control.value).pipe(
            map((res) => {
              // "emailExists" the name being given to the custom async validator (similar to validators.required and validators.pattern)
              return res ? { emailExists: true } : null;
            })
          );
        })
      );
    };
  }

  onSubmit() {
    this.errors = null;
    this.accountService.register$(this.registerForm.value, '/shop').subscribe(
      () => {},
      (error) => {
        this.errors = error.errors;
      }
    );
  }
}
