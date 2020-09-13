import {NgModule} from '@angular/core';
import {UserBasketComponent} from './user-basket.component';
import {BasketOpenButtonComponent} from './basket-open-button/basket-open-button.component';
import {BasketAddButtonComponent} from './basket-add-button/basket-add-button.component';
import {BasketItemsComponent} from './basket-items/basket-items.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {BasketItemConfirmDeleteDialogComponent} from './basket-item-confirm-delete-dialog/basket-item-confirm-delete-dialog.component';
import {ShopCoreModule} from '../shop-core/shop-core.module';

@NgModule({
  declarations: [
    UserBasketComponent,
    BasketOpenButtonComponent,
    BasketAddButtonComponent,
    BasketItemsComponent,
    CheckoutComponent,
    BasketItemConfirmDeleteDialogComponent
  ],
  imports: [
    ShopCoreModule,
  ],
  exports: [UserBasketComponent, BasketOpenButtonComponent, BasketAddButtonComponent],
})
export class BasketModule {
}
