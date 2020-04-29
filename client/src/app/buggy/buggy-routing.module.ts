import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuggyComponent } from './buggy.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: BuggyComponent },
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class BuggyRoutingModule { }
