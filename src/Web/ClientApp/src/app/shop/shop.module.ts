import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {HeaderComponent} from './layout/header/header.component';
import {HomeComponent} from './home/home.component';

import {LayoutComponent} from './layout/layout.component';
import {SnackbarMessageComponent} from './snackbar-message/snackbar-message.component';
import {ProductDetailsComponent} from './product-details/product-details.component';
import {CatalogsComponent} from './catalogs/catalogs.component';
import {BrandDetailsComponent} from './brands/brand-details/brand-details.component';
import {BasketModule} from './user-basket/basket.module';
import {FooterComponent} from './layout/footer/footer.component';
import {UserBasketComponent} from './user-basket/user-basket.component';
import {CheckoutComponent} from './user-basket/checkout/checkout.component';
import {Ng5SliderModule} from 'ng5-slider';
import {UserBasketCheckoutGuard} from './user-basket/user-basket-checkout.guard';
import {SearchHeaderDropdownComponent} from './layout/header/search-header-dropdown/search-header-dropdown.component';
import {HomeNewestProductsComponent} from './home/home-newest-products/home-newest-products.component';
import {BrandsComponent} from './brands/brands.component';
import {BrandProductListComponent} from './brands/brand-details/brand-product-list/brand-product-list.component';
import {ContactsComponent} from './contacts/contacts.component';
import {AboutComponent} from './about/about.component';
import {DeliveryComponent} from './delivery/delivery.component';
import {HeaderType1Component} from './layout/header/header-type1/header-type1.component';
import {BreakpointTextComponent} from './layout/header/breakpoint-text/breakpoint-text.component';
import {HeaderType2Component} from './layout/header/header-type2/header-type2.component';
import {SearchComponent} from './search/search.component';
import {HomeNewestProductsResolver} from './home-newest-products.resolver';
import {HomePopularProductsComponent} from './home/home-popular-products/home-pupular-products.component';
import {NavigationResolver} from './NavigationResolver';
import {ApiAuthorizationModule} from '../api-authorization/api-authorization.module';
import {LoginMenuComponent} from './layout/header/login-menu/login-menu.component';
import {ProductLayoutModule} from './product-layout/product-layout.module';
import {ShopCoreModule} from './shop-core/shop-core.module';
import {CatalogResolver} from './catalog.resolver';
import {BrandResolver} from './brand.resolver';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SearchComponent,
    LayoutComponent,
    SnackbarMessageComponent,
    BrandsComponent,
    ProductDetailsComponent,
    CatalogsComponent,
    BrandDetailsComponent,
    BrandsComponent,
    HomeNewestProductsComponent,
    HomePopularProductsComponent,
    SearchHeaderDropdownComponent,
    BrandProductListComponent,
    ContactsComponent,
    AboutComponent,
    DeliveryComponent,
    HeaderType1Component,
    HeaderType2Component,
    BreakpointTextComponent,
    SearchComponent,
    LoginMenuComponent,
  ],
  imports: [
    ShopCoreModule,
    BasketModule,
    RouterModule.forChild([
      {
        path: '',
        component: LayoutComponent,
        resolve: {navData: NavigationResolver},
        children: [
          {
            path: '',
            component: HomeComponent,
            resolve: {newestProducts: HomeNewestProductsResolver}
          },
          {
            path: '~',
            loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
          },
          {
            path: 'search',
            component: SearchComponent,
          },
          {
            path: 'contacts',
            component: ContactsComponent,
          },
          {
            path: 'about',
            component: AboutComponent,
          },
          {
            path: 'delivery',
            component: DeliveryComponent,
          },
          {
            path: 'basket',
            component: UserBasketComponent,
          },
          {
            path: 'basket/checkout',
            component: CheckoutComponent,
            canActivate: [UserBasketCheckoutGuard],
          },
          {
            path: 'brands',
            component: BrandsComponent,
          },
          {
            path: 'catalogs',
            component: CatalogsComponent,
            resolve: {resolveResult: CatalogResolver},
          },
          {
            path: 'catalogs/:id',
            component: CatalogsComponent,
            resolve: {resolveResult: CatalogResolver},
          },
          {
            path: 'products/:id',
            component: ProductDetailsComponent,
          },
          {
            path: 'brands',
            component: BrandsComponent,
          },
          {
            path: 'brands/:id',
            component: BrandDetailsComponent,
            resolve: {resolve: BrandResolver}
          }
        ]
      },
    ]),
    ProductLayoutModule,
    Ng5SliderModule,
    ApiAuthorizationModule
  ],
  entryComponents: [SnackbarMessageComponent],
})
export class ShopModule {
}
