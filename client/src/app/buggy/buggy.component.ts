import { Component, OnInit } from '@angular/core';
import { BuggyService } from './buggy.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IApiValidationError } from '../shared/models/i-api-validation-error';

@Component({
  selector: 'app-buggy',
  templateUrl: './buggy.component.html',
  styleUrls: ['./buggy.component.scss'],
})
export class BuggyComponent implements OnInit {
  validationError: IApiValidationError;
  baseUrl = environment.apiUrl;

  constructor(private buggyService: BuggyService, private http: HttpClient) {}

  ngOnInit(): void {}

  product404Error() {
    this.http.get(this.baseUrl + 'products/99999').subscribe(
      (r) => {
        console.log(r);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  notFoundError() {
    this.buggyService.getNotFound().subscribe(
      (r) => {
        console.log(r);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  serverError() {
    this.buggyService.getServerError().subscribe(
      (r) => {
        console.log(r);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  badRequestError(id?: number | string) {
    this.buggyService.getBadRequest(id).subscribe(
      (r) => {
        console.log(r);
      },
      (error) => {
        this.validationError = error;
        console.log(error);
      }
    );
  }
}
