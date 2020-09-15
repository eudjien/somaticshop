import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SnackbarMessageComponent} from './shop/snackbar-message/snackbar-message.component';
import {PageNotFoundComponent} from './core/page-not-found/page-not-found.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {AuthorizeInterceptor} from './api-authorization/authorize.interceptor';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BREAKPOINT, LAYOUT_CONFIG, LayoutConfigOptions} from '@angular/flex-layout';
import {BOOTSTRAP_BREAKPOINTS} from './core/custom-breakpoints';
import {AnonymousGuard} from './api-authorization/anonymous.guard';
import {AdminGuard} from './api-authorization/admin.guard';
import {AuthorizeGuard} from './api-authorization/authorize.guard';

// {
//   path: 'mgmt',
//   canActivate: [AuthorizeGuard, AdminGuard],
//   loadChildren: () => import('./../modules/management/management.module').then(m => m.ManagementModule)
// },

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
        loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule),
      },
      {
        path: '',
        canActivate: [AnonymousGuard],
        loadChildren: () => import('./authorization/authorization.module').then(m => m.AuthorizationModule)
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
