import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SnackbarMessageComponent} from '../modules/shop/snackbar-message/snackbar-message.component';
import {PageNotFoundComponent} from '../modules/core/page-not-found/page-not-found.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {AuthorizeInterceptor} from '../modules/api-authorization/authorize.interceptor';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BREAKPOINT, LAYOUT_CONFIG, LayoutConfigOptions} from '@angular/flex-layout';
import {BOOTSTRAP_BREAKPOINTS} from '../modules/core/custom-breakpoints';
import {AnonymousGuard} from '../modules/api-authorization/anonymous.guard';
import {AdminGuard} from '../modules/api-authorization/admin.guard';
import {AuthorizeGuard} from '../modules/api-authorization/authorize.guard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: '',
        loadChildren: () => import('./../modules/shop/shop.module').then(m => m.ShopModule),
      },
      {
        path: 'mgmt',
        canActivate: [AuthorizeGuard, AdminGuard],
        loadChildren: () => import('./../modules/management/management.module').then(m => m.ManagementModule)
      },
      {
        path: '',
        canActivate: [AnonymousGuard],
        loadChildren: () => import('./../modules/authorization/authorization.module').then(m => m.AuthorizationModule)
      },
      {
        path: '**', pathMatch: 'full', component: PageNotFoundComponent
      }
    ]),
  ],
  entryComponents: [SnackbarMessageComponent],
  bootstrap: [AppComponent],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true},
    {provide: BREAKPOINT, useValue: BOOTSTRAP_BREAKPOINTS, multi: true},
    {provide: LAYOUT_CONFIG, useValue: <LayoutConfigOptions>{disableDefaultBps: true}, multi: true}
  ]
})
export class AppModule {
}
