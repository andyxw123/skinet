import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { Injectable, isDevMode } from '@angular/core';
import { catchError, delay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

// HttpInterceptors MUST be injectable
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toast: ToastrService
  ) {}

  intercept(
    req: HttpRequest<any>, // Outgoing request
    next: HttpHandler // Incoming response
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error) {
          const apiError = error.error;

          switch (error.status) {
            case 400:
            case 401:
                // Throw the errors onto the component to display
                throw apiError;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              // Pass the error object to the server-error page via the router's "state" variable
              const navigationExtras: NavigationExtras = { state: { apiException: apiError } };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
          }
        }
        return throwError(error);
      })
    );
  }
}
