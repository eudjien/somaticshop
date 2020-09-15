import {Component, OnInit} from '@angular/core';
import {User} from '../../../../../models/User';
import {AccountService} from '../../../../../services/account.service';
import {AuthorizeService} from '../../../../api-authorization/authorize.service';
import {MediaObserver} from '@angular/flex-layout';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {switchMapTo} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-account-update-personal-data',
  templateUrl: './account-update-personal-data.component.html',
  styleUrls: ['./account-update-personal-data.component.scss']
})
export class AccountUpdatePersonalDataComponent implements OnInit {

  isLoading = false;

  user: User;

  fullNameForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    surName: new FormControl(''),
  });

  emailFormControl: FormControl = new FormControl('', Validators.email);
  phoneNumberFormControl: FormControl = new FormControl('');

  constructor(
    private _accountService: AccountService,
    private _authorizeService: AuthorizeService,
    private _mediaObserver: MediaObserver,
    private _snackbar: MatSnackBar) {
    this.load();
  }

  ngOnInit(): void {
  }

  updateFullName(): void {
    const firstName = this.fullNameForm.get('firstName').value;
    const lastName = this.fullNameForm.get('lastName').value;
    const surName = this.fullNameForm.get('surName').value;
    this.isLoading = true;
    this._accountService.updateFullName(firstName, lastName, surName)
      .pipe(switchMapTo(this._accountService.getUser()))
      .subscribe((user) => {
        this.initUser(user);
        this._snackbar.open('Данные успешно изменены!', null, {duration: 3500});
      }).add(() => this.isLoading = false);
  }

  updateEmail(): void {
    const email = this.emailFormControl.value;
    this.isLoading = true;
    this._accountService.updateEmail(email)
      .pipe(switchMapTo(this._accountService.getUser()))
      .subscribe(() => {
        this._snackbar.open('Email успешно изменен!', null, {duration: 3500});
      }).add(() => this.isLoading = false);
  }

  updatePhoneNumber(): void {
    const phoneNumber = this.phoneNumberFormControl.value;
    this.isLoading = true;
    this._accountService.updatePhoneNumber(phoneNumber)
      .pipe(switchMapTo(this._accountService.getUser()))
      .subscribe(() => {
        this._snackbar.open('Номер телефона успешно изменен!', null, {duration: 3500});
      }).add(() => this.isLoading = false);
  }

  fullNameHasModified(): boolean {
    return !(this.fullNameForm.get('firstName').value === this.user.firstName
      && this.fullNameForm.get('lastName').value === this.user.lastName
      && this.fullNameForm.get('surName').value === this.user.surName);
  }

  emailHasModified(): boolean {
    return this.emailFormControl.value !== this.user.email;
  }

  phoneNumberHasModified(): boolean {
    return this.phoneNumberFormControl.value !== this.user.phoneNumber;
  }

  load(): void {
    this.isLoading = true;
    this._accountService.getUser().subscribe(user => {
      this.initUser(user);
    }).add(() => this.isLoading = false);
  }

  initUser(user: User): void {
    this.fullNameForm.setValue({firstName: user.firstName, lastName: user.lastName, surName: user.surName});
    this.emailFormControl.setValue(user.email);
    this.phoneNumberFormControl.setValue(user.phoneNumber);
    this.user = user;
  }
}
