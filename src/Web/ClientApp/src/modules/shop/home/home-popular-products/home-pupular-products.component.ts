import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../../../services/product.service';
import {map, switchMap} from 'rxjs/operators';
import {zip} from 'rxjs';
import {ProductCard} from '../../../../viewModels/ProductCard';
import {BrandService} from '../../../../services/brand.service';
import {BrandCard} from '../../../../viewModels/BrandCard';
import {AppConstants} from '../../../../app-constants';

@Component({
  selector: 'app-home-popular-products',
  templateUrl: './home-popular-products.component.html',
  styleUrls: ['./home-popular-products.component.scss']
})
export class HomePopularProductsComponent implements OnInit {

  isLoading = false;

  cards: ProductCard[];

  constructor(private _productService: ProductService,
              private _brandService: BrandService) {
  }

  get currency(): string {
    return AppConstants.CURRENCY;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this._productService.getProductsPage(
      1,
      new Map<string, string>().set('date', 'desc'),
      null,
      null,
      10
    ).pipe(switchMap(pg =>
      zip(...pg.items.map(p =>
        zip(this._productService.getProductOverviewImageUrl(p.id),
          zip(this._brandService.getBrandById(p.brandId), this._brandService.getBrandImageUrl(p.brandId))
            .pipe(map(([b, biUrl]) => new BrandCard(b.id, b.title, b.content, biUrl))))
          .pipe(map(([pImg, brand]) => new ProductCard(p.id, p.title, p.description, p.price, brand, pImg)))))))
      .subscribe(viewModels => {
        this.cards = viewModels;
      }).add(() => this.isLoading = false);
  }
}
