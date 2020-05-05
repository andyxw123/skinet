import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { DevEnvGuard } from './_guards/dev-env.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { breadcrumb: 'Home' },
  },
  {
    path: 'server-error',
    component: ServerErrorComponent,
    data: { breadcrumb: 'Error' }, // <xng-breadcrumb> uses data.breadcrumb to display the location name
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: { breadcrumb: 'Not Found' },
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
  },
  {
    path: 'buggy',
    loadChildren: () =>
      import('./buggy/buggy.module').then((mod) => mod.BuggyModule),
    canLoad: [DevEnvGuard], // Prevent navigation to this route in the prod environment
    data: { breadcrumb: 'Buggy Page' },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
