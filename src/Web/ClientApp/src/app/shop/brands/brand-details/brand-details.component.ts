import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../../../services/product.service';
import {BrandService} from '../../../../services/brand.service';
import {CatalogService} from '../../../../services/catalog.service';
import {FileService} from '../../../../services/file.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveBreadcrumbItem, BreadcrumbItem, LinkBreadcrumbItem} from '../../shop-core/breadcrumbs/breadcrumbs.component';
import {BrandResolveResult} from '../../brand.resolver';
import {ProductSort} from '../../../../models/sort/ProductSort';
import {Page} from '../../../../models/Page';
import {ProductCard} from '../../../../viewModels/ProductCard';

@Component({
  selector: 'app-brand-details',
  templateUrl: './brand-details.component.html',
  styleUrls: ['./brand-details.component.scss']
})
export class BrandDetailsComponent implements OnInit {

  data: BrandResolveResult;
  page: Page<ProductCard>;

  constructor(
    private _productService: ProductService,
    private _brandService: BrandService,
    private _catalogService: CatalogService,
    private _fileService: FileService,
    private _route: ActivatedRoute,
    private _router: Router) {
    this.data = _route.snapshot.data.resolve as BrandResolveResult;
  }

  get breadcrumbs(): BreadcrumbItem[] {
    return [
      new LinkBreadcrumbItem('/', 'Главная'),
      new LinkBreadcrumbItem('/brands', 'Бренды'),
      new ActiveBreadcrumbItem(this.data.brand.name),
    ];
  }

  ngOnInit(): void {
  }
}
