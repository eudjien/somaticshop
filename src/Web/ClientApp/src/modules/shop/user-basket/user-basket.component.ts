import {Component, OnInit} from '@angular/core';
import {forkJoin, Observable, of} from 'rxjs';
import {BasketViewModel} from '../../../viewModels/BasketViewModel';
import {UserBasketService} from '../../../services/user-basket.service';
import {ProductService} from '../../../services/product.service';
import {defaultIfEmpty, map, mapTo, mergeAll, switchMap, tap} from 'rxjs/operators';
import {BasketProductViewModel} from '../../../viewModels/BasketProductViewModel';
import {Product} from '../../../models/product/Product';
import {AppConstants} from '../../../app-constants';

@Component({
  selector: 'app-basket',
  templateUrl: './user-basket.component.html',
  styleUrls: ['./user-basket.component.scss']
})
export class UserBasketComponent implements OnInit {

  isLoading = false;

  basketViewModel$: Observable<BasketViewModel>;

  constructor(
    private _userBasketService: UserBasketService,
    private _productService: ProductService) {
  }

  get currency(): string {
    return AppConstants.CURRENCY;
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.basketViewModel$ = of(new BasketViewModel()).pipe(switchMap(basketVm =>
      this._userBasketService.basketProducts()
        .pipe(map(bps => forkJoin(bps.map(bp => this._productService.getProductById(bp.productId)
          .pipe(map(p => this.createBasketProductViewModel(bp, p))))).pipe(defaultIfEmpty([]))
          .pipe(tap(bpVm =>
            (basketVm.basketProductViewModels = bpVm)), mapTo(basketVm)))
        )), mergeAll(), tap(() => this.isLoading = false));
  }

  createBasketProductViewModel(basketProduct: BasketProductViewModel, product: Product): BasketProductViewModel {
    return new BasketProductViewModel(
      product.id,
      product.title,
      this._productService.getProductOverviewImageUrl(product.id),
      basketProduct.quantity,
      product.price,
      product.price * basketProduct.quantity,
      product.description);
  }

  getSummary(viewModel: BasketViewModel): number {
    return viewModel.basketProductViewModels.map(a => a.quantity * a.unitPrice).reduce((a, b) => a + b, 0);
  }

  updated($event: BasketProductViewModel) {

  }
}
