import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {AuthenticationResultStatus, AuthorizeService} from '../../api-authorization/authorize.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarMessageComponent} from '../../shop/snackbar-message/snackbar-message.component';
import {switchMap, switchMapTo, tap} from 'rxjs/operators';

export function confirmPasswordValidator(): ValidatorFn {
  return (passwordConfirmControl: AbstractControl): { [key: string]: any } | null => {
    console.log(passwordConfirmControl.value);
    const passwordControl = passwordConfirmControl.parent.get('password');
    console.log(passwordControl.value);
    const equals = passwordConfirmControl.value === passwordControl.value;
    return equals ? {'equals': {value: equals}} : null;
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  authenticated = false;
  isLoading = false;
  loadingMessage: string;

  registerForm = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    passwordConfirm: new FormControl(null, [Validators.required, confirmPasswordValidator]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private _authorizeService: AuthorizeService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private httpClient: HttpClient,
    private _route: ActivatedRoute,
    private _router: Router,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  ngOnInit() {
  }

  onSubmit(registerFormData): void {

    if (this.registerForm.invalid) {
      return;
    }

    this.loadingStatus(true);

    const body = {
      'username': this.registerForm.get('username').value,
      'password': this.registerForm.get('password').value,
    };

    this.httpClient.post(`${this.baseUrl}api/account/register`, registerFormData)
      .pipe(tap(() => {
          this.loadingStatus(true, 'Регистрация успешно завершена, вход в аккаунт..');
        }),
        switchMapTo(this.httpClient.post(`${this.baseUrl}api/account/login`, body)),
        switchMap(state => this._authorizeService.signIn(state)))
      .subscribe(async result => {
        switch (result.status) {
          case AuthenticationResultStatus.Success:
            await this.navigateToRedirectUrl();
            break;
          case AuthenticationResultStatus.Fail:
            this.openSnackBar('Ошибка аунтификации');
            break;
          case AuthenticationResultStatus.Redirect:
            break;
        }
      }, (error: HttpErrorResponse) => {
        try {
          this.showError(error);
        } catch {
          this.openSnackBar('Что то пошло не так.');
        }
      }).add(() => this.loadingStatus(false, ''));
  }

  private openSnackBar(message: string): void {
    this._snackBar.open(message, null, {
      duration: 3500,
      verticalPosition: 'bottom',
    });
  }

  private loadingStatus(enabled: boolean, message: string = null): void {
    enabled ? this.registerForm.disable() : this.registerForm.enable();
    this.isLoading = enabled;
    this.loadingMessage = enabled ? message : null;
  }

  private showError(errorResponse: HttpErrorResponse): void {
    const keys = Object.keys(errorResponse.error.errors);
    const errorArray = keys.map(key => errorResponse.error.errors[key]).reduce((a, b) => a.concat(b));
    this._snackBar.openFromComponent(SnackbarMessageComponent, {
      verticalPosition: 'bottom',
      data: errorArray,
      duration: 3500
    });
  }

  private async navigateToRedirectUrl() {
    const returnUrl = this._route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl) {
      const successNavigate = await this._router.navigateByUrl(returnUrl);
      if (!successNavigate) {
        await this._router.navigateByUrl('/');
      }
    } else {
      await this._router.navigateByUrl('/');
    }
  }
}
