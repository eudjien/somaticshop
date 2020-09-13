import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppCoreModule} from '../core/app-core.module';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';

const routes: Routes = [
  {
    path: 'signIn',
    component: LoginComponent,
  },
  {
    path: 'signUp',
    component: RegisterComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppCoreModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthorizationModule {
}
