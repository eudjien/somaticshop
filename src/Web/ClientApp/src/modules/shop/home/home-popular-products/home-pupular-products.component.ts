import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../../../services/product.service';
import {map, switchMap} from 'rxjs/operators';
import {zip} from 'rxjs';
import {ProductCard} from '../../../../viewModels/ProductCard';
import {BrandService} from '../../../../services/brand.service';
import {BrandCard} from '../../../../viewModels/BrandCard';
import {AppConstants} from '../../../../app-constants';
import {Page} from '../../../../models/Page';
import {ProductSort} from '../../../../models/ProductSort';

@Component({
  selector: 'app-home-popular-products',
  templateUrl: './home-popular-products.component.html',
  styleUrls: ['./home-popular-products.component.scss']
})
export class HomePopularProductsComponent implements OnInit {

  isLoading = false;

  page: Page<ProductCard>;

  constructor(private _productService: ProductService,
              private _brandService: BrandService) {
  }

  get currency(): string {
    return AppConstants.CURRENCY;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this._productService.getProductsPage(0, null, ProductSort.OrdersDesc, 10).pipe(switchMap(pg =>

      zip(...pg.items.map(p =>
        zip(this._productService.getProductOverviewImageUrl(p.id),
          zip(this._brandService.getBrandById(p.brandId), this._brandService.getBrandImageUrl(p.brandId))
            .pipe(map(([b, biUrl]) => new BrandCard(b.id, b.name, b.content, biUrl)))
        ).pipe(map(([pImg, brand]) => new ProductCard(p.id, p.name, p.description, p.price, brand, pImg))))
      ).pipe(map(cards => new Page(cards, pg.pageIndex, pg.totalPages, pg.totalItems, pg.hasPreviousPage, pg.hasNextPage)))))
      .subscribe(page => {
        this.page = page;
      }).add(() => this.isLoading = false);

  }
}
















