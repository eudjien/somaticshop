import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayLoaderComponent} from './overlay-loader/overlay-loader.component';
import {MatModules} from '../../MatModules';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {BrandCardComponent} from './items/brand-card/brand-card.component';
import {OrderCardComponent} from './items/order-card/order-card.component';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {PaginationComponent} from './pagination/pagination.component';
import {ShrinkPipe} from './pipes/shrink.pipe';

@NgModule({
  declarations: [
    BrandCardComponent,
    OrderCardComponent,
    OverlayLoaderComponent,
    PageNotFoundComponent,
    PaginationComponent,
    ShrinkPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...MatModules,
    FlexLayoutModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayLoaderComponent,
    BrandCardComponent,
    OrderCardComponent,
    PageNotFoundComponent,
    RouterModule,
    ...MatModules,
    FlexLayoutModule,
    PaginationComponent,
    ShrinkPipe
  ],
})
export class AppCoreModule {
}
