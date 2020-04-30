import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShopService } from '../shop.service';
import { IProduct } from 'src/app/shared/models/i-product';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  quantity = 0;

  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private bcService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.bcService.set('@productDetails', 'Loading...');

    // Note the + prefix - this casts the string to a number
    // You can also subscribe to this.route.queryParams to respond to querystring changes
    this.getProduct(+this.route.snapshot.paramMap.get('id'));
  }

  getProduct(id: number) {
    this.shopService.getProduct(id).subscribe(
      (data) => {
        this.product = data;
        this.bcService.set('@productDetails', this.product.name);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity) {
      this.quantity--;
    }
  }
}
