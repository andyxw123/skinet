import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { htmlAstToRender3Ast } from '@angular/compiler/src/render3/r3_template_transform';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuggyService {
  baseUrl = environment.apiUrl + 'buggy/';

  constructor(private http: HttpClient) { }

  getNotFound$() {
    return this.http.get(this.baseUrl + 'notfound');
  }

  getServerError$() {
    return this.http.get(this.baseUrl + 'servererror');
  }

  getBadRequest$(id?: number | string) {
    // If the id is a string, the ApiResponse object will contain an array of validation errors
    // including an item saying "The value 'blah' is not valid"
    return this.http.get(this.baseUrl + 'badrequest/' + (id || ''));
  }
}
