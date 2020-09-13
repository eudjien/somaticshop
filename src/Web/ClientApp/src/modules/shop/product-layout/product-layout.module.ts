import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductListLayoutComponent} from './product-list-layout/product-list-layout.component';
import {ProductLayoutComponent} from './product-layout.component';
import {ProductCardLayoutComponent} from './product-card-layout/product-card-layout.component';
import {ProductCardItemComponent} from './product-card-layout/product-card-item/product-card-item.component';
import {ProductListItemComponent} from './product-list-layout/product-list-item/product-list-item.component';
import {BrandLinkComponent} from '../shop-core/brand-link/brand-link.component';
import {ProductLayoutFooterComponent} from './product-layout-footer/product-layout-footer.component';
import {ProductLayoutHeaderComponent} from './product-layout-header/product-layout-header.component';
import {LayoutModeHeaderComponent} from './product-layout-header/layout-mode-header/layout-mode-header.component';
import {LayoutSortHeaderComponent} from './product-layout-header/layout-sort-header/layout-sort-header.component';
import {ShopCoreModule} from '../shop-core/shop-core.module';

@NgModule({
  declarations: [
    ProductCardLayoutComponent,
    ProductListLayoutComponent,
    ProductLayoutComponent,
    ProductCardItemComponent,
    ProductListItemComponent,
    ProductLayoutHeaderComponent,
    ProductLayoutFooterComponent,
    LayoutModeHeaderComponent,
    LayoutSortHeaderComponent,
  ],
  exports: [
    ProductCardLayoutComponent,
    ProductListLayoutComponent,
    ProductLayoutComponent,
    ProductLayoutHeaderComponent,
    ProductLayoutFooterComponent,
    LayoutModeHeaderComponent,
    LayoutSortHeaderComponent,
  ],
  imports: [
    ShopCoreModule,
  ]
})
export class ProductLayoutModule {
  constructor() {
  }
}
