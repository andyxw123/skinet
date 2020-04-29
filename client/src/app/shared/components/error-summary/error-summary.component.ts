import { Component, OnInit, Input } from '@angular/core';
import { IApiValidationError } from '../../models/i-api-validation-error';

@Component({
  selector: 'app-error-summary',
  templateUrl: './error-summary.component.html',
  styleUrls: ['./error-summary.component.scss'],
})
export class ErrorSummaryComponent implements OnInit {
  @Input() messages: string[];
  @Input() validationError: IApiValidationError;
  errorMessages: string[];

  constructor() {}

  ngOnInit(): void {}

  getErrorMessages() {
    this.errorMessages = [];

    Array.prototype.push.apply(this.errorMessages, this.messages);

    if (this.validationError) {
      Array.prototype.push.apply(this.errorMessages, this.validationError.errors);
    }

    return this.errorMessages;
  }
}
