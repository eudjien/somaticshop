import {NgModule} from '@angular/core';
import {ContainerToolbarComponent} from './container-toolbar/container-toolbar.component';
import {BreadcrumbsComponent} from './breadcrumbs/breadcrumbs.component';
import {AppCoreModule} from '../../core/app-core.module';
import {BrandLinkComponent} from './brand-link/brand-link.component';
import {BrandItemComponent} from './brand-item/brand-item.component';


@NgModule({
  declarations: [
    ContainerToolbarComponent,
    BreadcrumbsComponent,
    BrandLinkComponent,
    BrandItemComponent,
  ],
  imports: [
    AppCoreModule
  ],
  exports: [
    AppCoreModule,
    ContainerToolbarComponent,
    BreadcrumbsComponent,
    BrandLinkComponent,
    BrandItemComponent,
  ]
})
export class ShopCoreModule {
}
