import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductListLayoutComponent} from './product-list-layout/product-list-layout.component';
import {ProductLayoutComponent} from './product-layout.component';
import {ProductCardsLayoutComponent} from './product-cards-layout/product-cards-layout.component';
import {ProductCardItemComponent} from './product-cards-layout/product-card-item/product-card-item.component';
import {AppCoreModule} from '../../core/app-core.module';
import {ProductListItemComponent} from './product-list-layout/product-list-item/product-list-item.component';
import {BrandLinkComponent} from './brand-link/brand-link.component';

@NgModule({
  declarations: [
    ProductCardsLayoutComponent,
    ProductListLayoutComponent,
    ProductLayoutComponent,
    ProductCardItemComponent,
    ProductListItemComponent,
    BrandLinkComponent
  ],
  exports: [
    ProductCardsLayoutComponent,
    ProductListLayoutComponent,
    ProductLayoutComponent
  ],
  imports: [
    CommonModule,
    AppCoreModule,
  ]
})
export class ProductLayoutModule {
  constructor() {
  }
}
