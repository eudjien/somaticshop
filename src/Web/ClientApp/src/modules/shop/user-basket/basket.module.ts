import {NgModule} from '@angular/core';
import {UserBasketComponent} from './user-basket.component';
import {BasketOpenButtonComponent} from './basket-open-button/basket-open-button.component';
import {BasketAddButtonComponent} from './basket-add-button/basket-add-button.component';
import {BasketItemsComponent} from './basket-items/basket-items.component';
import {AppCoreModule} from '../../core/app-core.module';
import {CheckoutComponent} from './checkout/checkout.component';
import {BasketItemConfirmDeleteDialogComponent} from './basket-item-confirm-delete-dialog/basket-item-confirm-delete-dialog.component';

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
    AppCoreModule,
  ],
  exports: [UserBasketComponent, BasketOpenButtonComponent, BasketAddButtonComponent],
})
export class BasketModule {
}
