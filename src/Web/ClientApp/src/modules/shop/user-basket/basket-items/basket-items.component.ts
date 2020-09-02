import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {BasketProductViewModel} from '../../../../viewModels/BasketProductViewModel';
import {MatTableDataSource} from '@angular/material/table';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConstants} from '../../../../app-constants';
import {UserBasketService} from '../../../../services/user-basket.service';
import {MatDialog} from '@angular/material/dialog';
import {BasketItemConfirmDeleteDialogComponent} from '../basket-item-confirm-delete-dialog/basket-item-confirm-delete-dialog.component';

@Component({
  selector: 'app-basket-items',
  templateUrl: './basket-items.component.html',
  styleUrls: ['./basket-items.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BasketItemsComponent implements OnInit {

  isLoading = false;

  @Output()
  updated: EventEmitter<BasketProductViewModel> = new EventEmitter<BasketProductViewModel>();

  displayedColumns: string[] = ['product', 'unitPrice', 'quantity', 'totalPrice'];

  dataSource: MatTableDataSource<BasketProductViewModel> = new MatTableDataSource<BasketProductViewModel>([]);

  constructor(
    private _userBasketService: UserBasketService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar) {
  }

  @Input()
  set viewModel(viewModel: BasketProductViewModel[]) {
    if (!this.dataSource.data?.length) {
      this.dataSource.data = viewModel;
    }
  }

  get currency(): string {
    return AppConstants.CURRENCY;
  }

  ngOnInit(): void {
  }

  deleteItemClick(viewModel: BasketProductViewModel): void {
    const dialogRef = this._dialog.open(BasketItemConfirmDeleteDialogComponent, {data: viewModel.title});
    dialogRef.afterClosed().subscribe(closeResult => {
      if (closeResult === true) {
        this.deleteItem(viewModel);
      }
    });
  }

  deleteItem(viewModel: BasketProductViewModel): void {
    this.isLoading = true;
    this._userBasketService.deleteBasketProduct(viewModel.id)
      .subscribe(
        () => {
          this.updated.emit(viewModel);
          this.dataSource.data = this.dataSource.data.filter(a => a.id !== viewModel.id);
          this.successDeleteMessage();
        },
        (error) => {

          this.errorMessage();
        })
      .add(() => {
        this.isLoading = false;
      });
  }

  quantityChange(viewModel: BasketProductViewModel, quantity: number, htmlInputElement: HTMLInputElement) {

    if (quantity < 1) {
      htmlInputElement.value = String(1);
      return;
    }

    this.isLoading = true;

    this._userBasketService.createOrUpdateBasketProduct(viewModel.id, quantity)
      .subscribe(
        (basketProduct) => {
          this.updatePrice(viewModel, quantity);
        },
        (error) => {

          this.errorMessage();
        })
      .add(() => this.isLoading = false);
  }

  updatePrice(viewModel: BasketProductViewModel, quantity: number): void {
    viewModel.quantity = quantity;
    viewModel.totalPrice = viewModel.unitPrice * quantity;
  }

  successDeleteMessage(): void {
    this._snackBar.open('Успешно удалено из корзины!', null, {duration: 3500});
  }

  errorMessage(): void {
    this._snackBar.open('Что то пошло не так. Попробуйте еще раз.', null, {duration: 3500});
  }
}
