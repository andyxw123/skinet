import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from '../shared/models/i-user';
import { ReplaySubject, of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;

  // Using a ReplaySubject here (rather than a BehaviorSubject) as it doesn't
  // emit its initial value. This means that the AuthGuard which will subscribe
  // to the currentUser$ will wait until its initial population (otherwise
  // the AuthGuard will prevent the route from being activated immediately afte
  // a page refresh)
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  loadCurrentUser$(token: string): Observable<IUser> {
    if (!token) {
      this.setCurrentUser(null);

      // Completes the observable subcription returning a null value
      return of(null);
    }

    return this.http
      .get(this.baseUrl + 'account')
      .pipe(map((user: IUser) => this.onLoginSuccessful(user)));
  }

  login$(values: any, navigateUrl?: string) {
    return this.http
      .post(this.baseUrl + 'account/login', values)
      .pipe(map((user: IUser) => this.onLoginSuccessful(user, navigateUrl)));
  }

  register$(values: any, navigateUrl?: string) {
    return this.http
      .post(this.baseUrl + 'account/register', values)
      .pipe(map((user: IUser) => this.onLoginSuccessful(user, navigateUrl)));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  setCurrentUser(user: IUser) {
    this.setToken(user?.token);
    this.currentUserSource.next(user);
  }

  initUserLogIn() {
    const token = this.getToken();

    this.loadCurrentUser$(token).subscribe(
      () => {},
      (error) => {
        this.logout(false);
      }
    );
  }

  checkEmailExists$(email: string) {
    return this.http.get(this.baseUrl + `account/emailexists?email=${email}&_`);
  }

  private onLoginSuccessful(user: IUser, navigateUrl?: string) {
    if (user) {
      this.setCurrentUser(user);

      if (navigateUrl === null || navigateUrl) {
        const returnUrl = this.route.snapshot.queryParams.return;
        this.router.navigateByUrl(returnUrl || navigateUrl || '/');
      }
    }
    return user;
  }

  logout(isNavigatingToRoot = true) {
    this.setCurrentUser(null);

    if (isNavigatingToRoot) {
      this.router.navigateByUrl('/');
    }
  }
}
