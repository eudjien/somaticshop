import {NgModule} from '@angular/core';
import {ProductNewComponent} from './products/product-new.component';
import {EditorComponent} from './editor/editor.component';
import {UploadImageMultiComponent} from './upload-image-multi/upload-image-multi.component';
import {BrandNewComponent} from './brands/brand-new.component';
import {LayoutComponent} from './layout/layout.component';
import {ManagementNavComponent} from './management-nav/management-nav.component';
import {BrandEditComponent} from './brands/brand-edit.component';
import {UploadImageMultiDeleteDialogComponent} from './upload-image-multi/upload-image-multi-delete-dialog/upload-image-multi-delete-dialog.component';
import {UploadImageSingleComponent} from './upload-image-single/upload-image-single.component';
import {UploadImageSingleDeleteDialogComponent} from './upload-image-single/upload-image-single-delete-dialog/upload-image-single-delete-dialog.component';
import {CatalogNewComponent} from './catalogs/catalog-new.component';
import {CatalogEditComponent} from './catalogs/catalog-edit.component';
import {ProductEditComponent} from './products/product-edit.component';
import {BrandListComponent} from './brands/brand-list/brand-list.component';
import {CatalogListComponent} from './catalogs/catalog-list/catalog-list.component';
import {ProductListComponent} from './products/product-list/product-list.component';
import {ProductGroupListComponent} from './product-groups/product-group-list/product-group-list.component';
import {SelectCatalogForCatalogComponent} from './selects/select-catalog-for-catalog/select-catalog-for-catalog.component';
import {SelectProductsForGroupComponent} from './selects/select-products-for-group/select-products-for-group.component';
import {DeleteCommonModalComponent} from '../shop/delete-common-modal/delete-common-modal.component';
import {ProductGroupNewComponent} from './product-groups/product-group-new.component';
import {EditProductGroupComponent} from './product-groups/edit-product-group.component';
import {SelectToDeleteProductsComponent} from './selects/select-products-for-group/select-to-delete-products/select-to-delete-products.component';
import {SelectProductsComponent} from './selects/select-products-for-group/select-products/select-products.component';
import {SelectGroupForProductComponent} from './selects/select-group-for-product/select-group-for-product.component';
import {SelectSpecificationsComponent} from './selects/select-specifications/select-specifications.component';
import {SelectBrandForProductComponent} from './selects/select-brand-for-product/select-brand-for-product.component';
import {SelectCatalogForProductComponent} from './selects/select-catalog-for-product/select-catalog-for-product.component';
import {AppCoreModule} from '../core/app-core.module';
import {OrderListComponent} from './orders/order-list/order-list.component';
import {RouterModule, Routes} from '@angular/router';
import {Ng5SliderModule} from 'ng5-slider';
import {ApiAuthorizationModule} from '../api-authorization/api-authorization.module';
import {CommonModule} from '@angular/common';
import { LoginMenuComponent } from './layout/header/login-menu/login-menu.component';
import { HeaderComponent } from './layout/header/header.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'brands/new',
        component: BrandNewComponent,
      },
      {
        path: 'brands/:id/edit',
        component: BrandEditComponent,
      },
      {
        path: 'brands',
        component: BrandListComponent,
      },
      {
        path: 'catalogs/new',
        component: CatalogNewComponent,
      },
      {
        path: 'catalogs/:id/edit',
        component: CatalogEditComponent,
      },
      {
        path: 'catalogs',
        component: CatalogListComponent,
      },
      {
        path: 'products/new',
        component: ProductNewComponent,
      },
      {
        path: 'products/:id/edit',
        component: ProductEditComponent,
      },
      {
        path: 'products',
        component: ProductListComponent,
      },
      {
        path: 'product-groups/new',
        component: ProductGroupNewComponent,
      },
      {
        path: 'product-groups/:id/edit',
        component: EditProductGroupComponent,
      },
      {
        path: 'product-groups',
        component: ProductGroupListComponent,
      },
      {
        path: 'orders',
        component: OrderListComponent,
      },
    ]
  },
];

@NgModule({
  declarations: [
    ProductNewComponent,
    EditorComponent,
    UploadImageMultiComponent,
    BrandNewComponent,
    LayoutComponent,
    ManagementNavComponent,
    BrandEditComponent,
    UploadImageMultiDeleteDialogComponent,
    UploadImageSingleComponent,
    UploadImageSingleDeleteDialogComponent,
    CatalogNewComponent,
    CatalogEditComponent,
    ProductEditComponent,
    BrandListComponent,
    CatalogListComponent,
    ProductListComponent,
    ProductGroupListComponent,
    OrderListComponent,
    SelectCatalogForCatalogComponent,
    SelectProductsForGroupComponent,
    DeleteCommonModalComponent,
    ProductGroupNewComponent,
    EditProductGroupComponent,
    SelectToDeleteProductsComponent,
    SelectProductsComponent,
    SelectGroupForProductComponent,
    SelectSpecificationsComponent,
    SelectBrandForProductComponent,
    SelectCatalogForProductComponent,
    LoginMenuComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    AppCoreModule,
    RouterModule.forChild(routes),
    Ng5SliderModule,
    ApiAuthorizationModule,
    CommonModule,
  ],
  exports: [],
})

export class ManagementModule {
}
