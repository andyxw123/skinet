import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

@NgModule({
   declarations: [
      AppComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      HttpClientModule,

      // Child app modules
      CoreModule,
      SharedModule,
      HomeModule,
   ],
   providers: [
      // Add to Angular's HTTP interceptors array - multi must be true
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true } // Intercept HTTP requests and redirect to error pages
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
