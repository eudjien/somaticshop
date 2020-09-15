import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Buyer} from '../../../../models/Buyer';
import {Address} from '../../../../models/Address';
import {OrderService} from '../../../../services/order.service';
import * as Cookies from 'js-cookie';
import {AuthorizeService} from '../../../api-authorization/authorize.service';
import {AccountService} from '../../../../services/account.service';
import {iif} from 'rxjs';
import {finalize, switchMap, take} from 'rxjs/operators';
import {Order} from '../../../../models/order/Order';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  isLoading = false;

  buyerFormGroup: FormGroup;
  addressFormGroup: FormGroup;
  commentFormControl: FormControl;

  successOrder: Order;

  constructor(
    private _orderService: OrderService,
    private _accountService: AccountService,
    private _authorizeService: AuthorizeService,
    private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buyerFormGroup = this._formBuilder.group({
      lastName: [''],
      firstName: ['', Validators.required],
      surName: [''],
      phoneNumber: ['', Validators.required],
      email: ['']
    });
    this.addressFormGroup = this._formBuilder.group({
      country: ['', Validators.required],
      address: ['', Validators.required],
      postCode: ['', Validators.required]
    });
    this.commentFormControl = new FormControl('');

    this.isLoading = true;
    this._authorizeService.isAuthenticated()
      .pipe(
        take(1),
        finalize(() => this.isLoading = false),
        switchMap(authenticated => iif(() => authenticated, this._accountService.getUser())))
      .subscribe(user => {
        this.buyerFormGroup.patchValue({lastName: user.lastName});
        this.buyerFormGroup.patchValue({firstName: user.firstName});
        this.buyerFormGroup.patchValue({surName: user.surName});
        this.buyerFormGroup.patchValue({phoneNumber: user.phoneNumber});
        this.buyerFormGroup.patchValue({email: user.email});
      });
  }

  orderClick(): void {
    const buyer = this.createBuyer();
    const address = this.createAddress();
    const comment = this.commentFormControl.value;
    this.createOrderRequest(buyer, address, comment);
  }

  createOrderRequest(buyer: Buyer, address: Address, comment: string): void {
    this.isLoading = true;
    this._orderService.createOrder(buyer, address, comment)
      .pipe(take(1), finalize(() => this.isLoading = false))
      .subscribe(order => this.successOrder = order);
  }

  createBuyer(): Buyer {
    const buyer = new Buyer();
    buyer.lastName = this.buyerFormGroup.get('lastName').value;
    buyer.firstName = this.buyerFormGroup.get('firstName').value;
    buyer.surName = this.buyerFormGroup.get('surName').value;
    buyer.phoneNumber = this.buyerFormGroup.get('phoneNumber').value;
    buyer.email = this.buyerFormGroup.get('email').value;
    buyer.userOrAnonymousId = Cookies.get('USER_BASKET');
    return buyer;
  }

  createAddress(): Address {
    const address = new Address();
    address.country = this.addressFormGroup.get('country').value;
    address.addressText = this.addressFormGroup.get('address').value;
    address.postalCode = this.addressFormGroup.get('postCode').value;
    return address;
  }
}
