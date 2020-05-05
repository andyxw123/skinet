import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShopService } from '../../shop.service';
import { IProduct } from 'src/app/shared/models/i-product';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  quantity = 1;

  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private bcService: BreadcrumbService,
    private basketService: BasketService
  ) {}

  ngOnInit(): void {
    this.bcService.set('@productDetails', 'Loading...');

    // Note the + prefix - this casts the string to a number
    // You can also subscribe to this.route.queryParams to respond to querystring changes
    this.getProduct(+this.route.snapshot.paramMap.get('id'));
  }

  getProduct(id: number) {
    this.shopService.getProduct$(id).subscribe(
      (data) => {
        this.product = data;
        this.bcService.set('@productDetails', this.product.name);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addItemToBasket() {
    this.basketService.addItemToBasket(this.product, this.quantity);
  }
}
