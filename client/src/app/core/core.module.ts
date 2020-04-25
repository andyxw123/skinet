import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';

// This module need to be added as in import to app.module.ts
@NgModule({
  declarations: [
    NavBarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavBarComponent   // Export the NavBar component to allow it to be used elsewhere
  ]
})
export class CoreModule { }
