import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthenticationResultStatus, AuthorizeService} from '../../api-authorization/authorize.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {fromPromise} from 'rxjs/internal-compatibility';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  isLoading = false;
  loadingMessage: string;

  loginForm: FormGroup = this._formBuilder.group({
    username: [{value: '', disabled: this.isLoading}, Validators.required],
    password: [{value: '', disabled: this.isLoading}, Validators.required],
    rememberMe: [{value: true, disabled: this.isLoading}]
  });

  private showPassword = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _authorizeService: AuthorizeService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  get passwordInputType(): string {
    return this.showPassword ? 'text' : 'password';
  }

  get passwordInputIcon(): string {
    return this.showPassword ? 'visibility_off' : 'visibility';
  }

  ngOnInit() {
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(formData): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    this.loadingStatus(true, 'Аунтефикация...');

    this._httpClient.post(`${this.baseUrl}api/account/login`, formData)
      .pipe(switchMap(state => fromPromise(this._authorizeService.signIn(state))))
      .subscribe(async result => {
        switch (result.status) {
          case AuthenticationResultStatus.Success:
            this.openSnackBar('Вход успешно совершен!');
            await this.navigateToRedirectUrl();
            break;
          case AuthenticationResultStatus.Fail:
            this.openSnackBar('Ошибка аунтификации');
            break;
          case AuthenticationResultStatus.Redirect:
            await this._router.navigateByUrl('/');
            break;
        }
      }, (error: HttpErrorResponse) => {

        try {
          this.openSnackBar('Неверный логин и/или пароль');
          // this.showError(error);
        } catch {
          this.openSnackBar('Что то пошло не так.');
        }
      }).add(() => this.loadingStatus(false));
  }

  private openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3500,
      verticalPosition: 'bottom',
    });
  }

  private loadingStatus(enabled: boolean, message: string = null): void {
    enabled ? this.loginForm.disable() : this.loginForm.enable();
    this.isLoading = enabled;
    this.loadingMessage = enabled ? message : null;
  }

  private async navigateToRedirectUrl(): Promise<void> {
    const returnUrl = this._route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl) {
      const successNavigate = await this._router.navigateByUrl(returnUrl);
      if (!successNavigate) {
        await this._router.navigate(['/']);
      }
    } else {
      await this._router.navigate(['/']);
    }
  }
}
