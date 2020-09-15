import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {BasketProduct} from '../../../../models/basket/BasketProduct';
import {UserBasketService} from '../../../../services/user-basket.service';
import {defaultIfEmpty, tap} from 'rxjs/operators';

@Component({
  selector: 'app-basket-open-button',
  templateUrl: './basket-open-button.component.html',
  styleUrls: ['./basket-open-button.component.scss']
})
export class BasketOpenButtonComponent implements OnInit {

  isLoading = false;

  basketProducts: BasketProduct[];
  basketProductsSubject$: Observable<BasketProduct[]>;

  constructor(
    private _userBasketService: UserBasketService,
    private _dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.basketProductsSubject$ = this._userBasketService.basketProducts()
      .pipe(defaultIfEmpty(<BasketProduct[]>[]), tap((bps) => {
        this.basketProducts = bps;
        this.isLoading = false;
      }));
  }

  getTotalCount(basketProducts: BasketProduct[]): number {
    return basketProducts?.map(p => p.quantity).reduce((a, b) => a + b, 0);
  }
}
