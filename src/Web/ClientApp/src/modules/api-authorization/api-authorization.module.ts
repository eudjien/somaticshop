import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';
import {RouterModule} from '@angular/router';
import {ApplicationPaths} from './api-authorization.constants';
import {HttpClientModule} from '@angular/common/http';
import {AppCoreModule} from '../core/app-core.module';

@NgModule({
  imports: [
    AppCoreModule,
    RouterModule.forChild(
      [
        {path: ApplicationPaths.Register, component: LoginComponent},
        {path: ApplicationPaths.Profile, component: LoginComponent},
        {path: ApplicationPaths.Login, component: LoginComponent},
        {path: ApplicationPaths.LoginFailed, component: LoginComponent},
        {path: ApplicationPaths.LoginCallback, component: LoginComponent},
        {path: ApplicationPaths.LogOut, component: LogoutComponent},
        {path: ApplicationPaths.LoggedOut, component: LogoutComponent},
        {path: ApplicationPaths.LogOutCallback, component: LogoutComponent}
      ]
    ),
    CommonModule,
  ],
  declarations: [LoginComponent, LogoutComponent],
  exports: [LoginComponent, LogoutComponent]
})
export class ApiAuthorizationModule {
}
