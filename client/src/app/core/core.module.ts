import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrModule  } from 'ngx-toastr';
import { BreadcrumbModule } from 'xng-breadcrumb';

import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { SharedModule } from '../shared/shared.module';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { DevHeaderComponent } from './components/dev-header/dev-header.component';
import { FormsModule } from '@angular/forms';
import { ThemeSelectorComponent } from './components/theme-selector/theme-selector.component';

// This module need to be added as an import to app.module.ts
@NgModule({
  declarations: [
    NavBarComponent,
    NotFoundComponent,
    ServerErrorComponent,
    SectionHeaderComponent,
    DevHeaderComponent,
    ThemeSelectorComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule,
    BreadcrumbModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    })
  ],
  exports: [
    DevHeaderComponent,
    NavBarComponent,   // Export the NavBar component to allow it to be used elsewhere
    SectionHeaderComponent,
    ThemeSelectorComponent,
  ]
})
export class CoreModule { }
