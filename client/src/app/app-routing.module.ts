import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { DevEnvGuard } from './core/guards/dev-env.guard';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { breadcrumb: 'Home' },
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: { breadcrumb: 'Not Found' },
  },
    {
    path: 'server-error',
    component: ServerErrorComponent,
    data: { breadcrumb: 'Error' }, // <xng-breadcrumb> uses data.breadcrumb to display the location name
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.module').then((mod) => mod.AccountModule),
    data: { breadcrumb: { skip: true } },
  },
  {
    path: 'shop',
    loadChildren: () =>
      import('./shop/shop.module').then((mod) => mod.ShopModule),
    data: { breadcrumb: 'Shop' },
  },
  {
    path: 'basket',
    loadChildren: () =>
      import('./basket/basket.module').then((mod) => mod.BasketModule),
      data: { breadcrumb: 'Basket' },
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./checkout/checkout.module').then((mod) => mod.CheckoutModule),
      data: { breadcrumb: 'Checkout' },
      canActivate: [AuthGuard]
  },
  {
    path: 'buggy',
    loadChildren: () =>
      import('./buggy/buggy.module').then((mod) => mod.BuggyModule),
    data: { breadcrumb: 'Buggy Page' },
    canLoad: [DevEnvGuard], // Prevent navigation to this route in the prod environment
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
