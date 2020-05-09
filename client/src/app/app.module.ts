import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { HttpDelayInterceptor } from './core/interceptors/http-delay.interceptor';
import { HttpBusySpinnerInterceptor } from './core/interceptors/http-busy-spinner-interceptor';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy, Scroll, Router } from '@angular/router';
import { AppRouteReuseStrategy } from './app-route-reuse-strategy';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,

    // Child app modules
    CoreModule,
    SharedModule,
    HomeModule,
  ],
  providers: [
    CookieService,
    { provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy },

    // Add to Angular's HTTP interceptors array - multi must be true
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Add the Authorization header token
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, // Intercept HTTP requests and redirect to error pages
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpBusySpinnerInterceptor,
      multi: true,
    }, // Displays a loading spinner during http requests
    { provide: HTTP_INTERCEPTORS, useClass: HttpDelayInterceptor, multi: true }, // Mimic a slow network in dev mode
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router, viewportScroller: ViewportScroller) {
    // Handle scrolling after navigation
    router.events
      .pipe(filter((e: Scroll): e is Scroll => e instanceof Scroll))
      .subscribe((e) => {
        // Scroller logic below only works when wrapped in a setTimeout
        setTimeout(() => {
          if (e.position) {
            // Backward navigation - restore scroll position
            viewportScroller.scrollToPosition(e.position);
          } else if (e.anchor) {
            // Anchor navigation
            viewportScroller.scrollToAnchor(e.anchor);
          } else {
            // Forward navigation - scroll top / left
            viewportScroller.scrollToPosition([0, 0]);
          }
        });
      });
  }
}
