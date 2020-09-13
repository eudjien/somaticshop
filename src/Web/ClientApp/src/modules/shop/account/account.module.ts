import {NgModule} from '@angular/core';
import {LoginComponent} from '../../authorization/login/login.component';
import {RegisterComponent} from '../../authorization/register/register.component';
import {AppCoreModule} from '../../core/app-core.module';
import {AccountComponent} from './account.component';
import {AccountUpdateComponent} from './edit/account-update.component';
import {AccountDetailsComponent} from './details/account-details.component';
import {PersonalDataComponent} from './details/personal-data/personal-data.component';
import {OrdersComponent} from './details/orders/orders.component';
import {AccountUpdatePasswordComponent} from './edit/account-update-password/account-update-password.component';
import {AccountUpdatePersonalDataComponent} from './edit/account-update-personal-data/account-update-personal-data.component';
import {OrderDetailsComponent} from './details/order-details/order-details.component';
import {RouterModule} from '@angular/router';
import {AuthorizeGuard} from '../../api-authorization/authorize.guard';
import {ShopCoreModule} from '../shop-core/shop-core.module';

@NgModule({
  declarations: [
    AccountComponent,
    LoginComponent,
    RegisterComponent,
    AccountUpdateComponent,
    AccountDetailsComponent,
    PersonalDataComponent,
    OrdersComponent,
    AccountUpdatePasswordComponent,
    AccountUpdatePersonalDataComponent,
    OrderDetailsComponent,
  ],
  imports: [
    AppCoreModule,
    ShopCoreModule,
    RouterModule.forChild([
      {
        path: '',
        component: AccountComponent,
        canActivate: [AuthorizeGuard],
        children: [
          {
            path: '',
            component: AccountDetailsComponent,
            children: [
              {
                path: '',
                component: PersonalDataComponent,
              },
              {
                path: 'orders',
                component: OrdersComponent,
              },
              {
                path: 'orders/:id',
                component: OrderDetailsComponent
              }
            ],
          },
          {
            path: 'update',
            component: AccountUpdateComponent,
            children: [
              {
                path: '',
                component: AccountUpdatePersonalDataComponent,
              },
              {
                path: 'password',
                component: AccountUpdatePasswordComponent,
              },
            ],
          },
        ]
      }
    ]),
  ],
  exports: [
    AccountComponent,
    LoginComponent,
    RegisterComponent,
  ],
})
export class AccountModule {
}
