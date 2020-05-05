import { v4 as uuidv4 } from 'uuid';
import { IBasket } from './i-basket';
import { IBasketItem } from './i-basket-item';

export class Basket implements IBasket  {
    id = uuidv4();
    items: IBasketItem[] = [];
}
