import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuggyComponent } from './buggy.component';
import { BuggyRoutingModule } from './buggy-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    BuggyComponent
  ],
  imports: [
    CommonModule,
    BuggyRoutingModule,
    SharedModule
  ]
})
export class BuggyModule { }
