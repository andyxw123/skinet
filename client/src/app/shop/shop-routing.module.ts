import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

const routes: Routes = [
  // To avoid the "Cannot reattach ActivatedRouteSnapshot created from a different route"
  // thrown by the AppRouteReuseStrategy when caching a component for reuse

  // Root path redirects to the ProductSearchComponent component
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  // Set reuse:true to cache the ProductSearchComponent to avoid losing search results.
  // Also skip the breadcrumb as this is set by the Shop route in app.routing
  {
    path: 'products',
    component: ProductSearchComponent,
    data: { breadcrumb: { skip: true }, reuse: true },
  },
  {
    path: 'products/:id',
    component: ProductDetailsComponent,
    // The breadcrumb alias will be populated by product-details.component.ts
    data: { breadcrumb: { alias: 'productDetails' } },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
