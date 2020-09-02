import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {AccountService} from '../../../../../services/account.service';
import {AuthorizeService} from '../../../../api-authorization/authorize.service';
import {MediaObserver} from '@angular/flex-layout';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {PasswordOptionsModel} from '../../../../../models/PasswordOptionsModel';

export function passwordCompareValidator(compareTo: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {

    if (control.parent) {

      const compareToControl = control.parent.get(compareTo);

      if (control.value) {
        if (compareToControl.value !== control.value) {
          return {'notEquals': true};
        }

      }
    }

    return null;
  };
}


@Component({
  selector: 'app-account-edit-change-password',
  templateUrl: './account-update-password.component.html',
  styleUrls: ['./account-update-password.component.scss']
})
export class AccountUpdatePasswordComponent implements OnInit {

  passwordOptions: PasswordOptionsModel;

  isLoading = false;

  form = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    confirmNewPassword: new FormControl('', [
      Validators.required, passwordCompareValidator('newPassword')
    ]),
  });

  constructor(
    private _accountService: AccountService,
    private _authorizeService: AuthorizeService,
    private _mediaObserver: MediaObserver,
    private _snackbar: MatSnackBar) {
    this.form.get('newPassword').valueChanges.subscribe(() =>
      this.form.get('confirmNewPassword').updateValueAndValidity());
  }

  ngOnInit(): void {
    this.loadPasswordOptions();
  }

  updatePassword(): void {
    const currentPassword = this.form.get('currentPassword').value;
    const newPassword = this.form.get('newPassword').value;
    this.isLoading = true;
    this._accountService.updatePassword(currentPassword, newPassword)
      .subscribe((response: HttpResponse<any>) => {
        this._snackbar.open('Пароль успешно изменен!', null, {duration: 3500});
      }, (errorResponse: HttpErrorResponse) => {
        if (Array.isArray(errorResponse.error)) {
          errorResponse.error
            .forEach(error => this.setPasswordError(error.code));
        } else {
          this._snackbar.open('Что то пошло не так.', null, {duration: 3500});
        }
      }).add(() => this.isLoading = false);
  }

  loadPasswordOptions(): void {
    this.isLoading = true;
    this._accountService.getPasswordOptions().subscribe(options => {
      this.passwordOptions = options;
    }).add(() => this.isLoading = false);
  }

  setPasswordError(code: string) {
    switch (code) {
      case 'PasswordMismatch':
        this.form.get('currentPassword').setErrors({passwordMismatch: true});
        break;
      case 'PasswordRequiresDigit':
        this.form.get('newPassword').setErrors({passwordRequiresDigit: true});
        break;
      case 'PasswordRequiresLower':
        this.form.get('newPassword').setErrors({passwordRequiresLower: true});
        break;
      case 'PasswordRequiresNonAlphanumeric':
        this.form.get('newPassword').setErrors({passwordRequiresNonAlphanumeric: true});
        break;
      case 'PasswordRequiresUniqueChars':
        this.form.get('newPassword').setErrors({passwordRequiresUniqueChars: true});
        break;
      case 'PasswordTooShort':
        this.form.get('newPassword').setErrors({passwordTooShort: true});
        break;
      case 'PasswordRequiresUpper':
        this.form.get('newPassword').setErrors({passwordRequiresUpper: true});
        break;
      default:
        this.form.setErrors({'otherError': 'Что то пошло не так.'});
    }
  }

  errorMessageByCode(code: string): string {
    switch (code) {
      case 'required':
        return 'Это поле обязательно для заполнения';
      case 'notEquals':
        return 'Пароли не совпадают';
      case 'passwordMismatch':
        return 'Не правильный пароль';
      case 'passwordRequiresDigit':
        return 'Пароль должен содержать цифру';
      case 'passwordRequiresLower':
        return 'Пароль должен содержать маленькую букву';
      case 'passwordRequiresNonAlphanumeric':
        return 'Пароль должен содержать любой символ (NonAlphanumeric)';
      case 'passwordRequiresUniqueChars':
        return `Пароль должен содержать минимум ${this.passwordOptions.requiredUniqueChars} уникальных символов`;
      case 'passwordTooShort':
        return `Пароль должен содержать не меньше чем ${this.passwordOptions.requiredLength} символов`;
      case 'passwordRequiresUpper':
        return `Пароль должен содержать большую букву`;
      default:
        return '';
    }
  }

  keysOf(object: any): string[] {
    if (!object) {
      return [];
    }
    return Object.keys(object);
  }
}
