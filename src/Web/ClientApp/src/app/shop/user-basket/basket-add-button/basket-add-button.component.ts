import {Component, Input, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserBasketService} from '../../../../services/user-basket.service';
import {BasketProduct} from '../../../../models/basket/BasketProduct';

@Component({
  selector: 'app-basket-add-button',
  templateUrl: './basket-add-button.component.html',
  styleUrls: ['./basket-add-button.component.scss']
})
export class BasketAddButtonComponent implements OnInit {

  isLoading = false;

  @Input()
  productId: number;

  quantity = 0;

  constructor(
    private _userBasketService: UserBasketService,
    private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this._userBasketService.basketProduct(this.productId).subscribe(basketProduct => {
      this.initQuantity(basketProduct);
      this.isLoading = false;
    }).add(() => {
      this.isLoading = false;
    });
  }

  addToBasket(): void {
    this.isLoading = true;
    this._userBasketService.createOrUpdateBasketProduct(this.productId, this.quantity + 1)
      .subscribe(
        (basketProduct) => {

          this.initQuantity(basketProduct);
          this.successMessage();
        },
        (error) => {

          this.errorMessage();
        }
      )
      .add(() => this.isLoading = false);
  }

  initQuantity(basketProduct: BasketProduct): void {
    this.quantity = basketProduct?.quantity ?? 0;
  }

  successMessage(): void {
    this._snackBar.open('Успешно добавлено в корзину!', null, {duration: 3500});
  }

  errorMessage(): void {
    this._snackBar.open('Что то пошло не так. Попробуйте еще раз.', null, {duration: 3500});
  }
}
