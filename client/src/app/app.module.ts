import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { HttpDelayInterceptor } from './core/interceptors/http-delay.interceptor';
import { HttpBusySpinnerInterceptor } from './core/interceptors/http-busy-spinner-interceptor';
import { FormsModule } from '@angular/forms';

@NgModule({
   declarations: [
      AppComponent
   ],
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
      // Add to Angular's HTTP interceptors array - multi must be true
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, // Intercept HTTP requests and redirect to error pages
      { provide: HTTP_INTERCEPTORS, useClass: HttpBusySpinnerInterceptor, multi: true }, // Displays a loading spinner during http requests
      { provide: HTTP_INTERCEPTORS, useClass: HttpDelayInterceptor, multi: true } // Mimic a slow network in dev mode
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
