import { IProduct } from './i-product';

export interface IBasketItem extends IProduct {
  quantity: number;
}
