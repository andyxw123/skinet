import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusyService } from '../services/busy.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class HttpBusySpinnerInterceptor implements HttpInterceptor {
  constructor(private busyService: BusyService) {}

  // Requests to urls containing the following won't display the busy spinner
  // (for situations where an in-line busy spinner is being diplayed etc)
  private ignoreUrlsEndingWith = [
    '&_',
    '?_'
  ];

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.ignoreUrlsEndingWith.some((x) => request.url.endsWith(x))) {
      this.busyService.busy();
    }
    return next.handle(request).pipe(
      finalize(() => {
        this.busyService.idle();
      })
    );
  }
}
