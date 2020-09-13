import {Component, Inject, OnInit} from '@angular/core';
import {ProductService} from '../../../../services/product.service';
import {BrandService} from '../../../../services/brand.service';
import {CatalogService} from '../../../../services/catalog.service';
import {FileService} from '../../../../services/file.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {map, switchMap} from 'rxjs/operators';
import {BrandDetailsViewModel} from '../../../../viewModels/BrandDetailsViewModel';
import {QuillDeltaToHtmlConverter} from 'quill-delta-to-html';

@Component({
  selector: 'app-brand-details',
  templateUrl: './brand-details.component.html',
  styleUrls: ['./brand-details.component.scss']
})
export class BrandDetailsComponent implements OnInit {

  id: number;
  isLoading = false;
  viewModel: BrandDetailsViewModel;

  constructor(
    private _productService: ProductService,
    private _brandService: BrandService,
    private _catalogService: CatalogService,
    private _fileService: FileService,
    private _route: ActivatedRoute,
    private _router: Router,
    @Inject(DOCUMENT) private document) {
    this._route.params.subscribe(params => {
      this.id = +params['id'];
      this.load(this.id);
    });
  }

  ngOnInit(): void {
  }

  private load(brandId: number): void {
    const brandWithImageObs = this._brandService.getBrandById(brandId)
      .pipe(switchMap(brand => this._brandService.getBrandImageUrl(brandId)
        .pipe(map(imageUrl => new BrandDetailsViewModel(brand.id, brand.name, brand.content, imageUrl)))));

    brandWithImageObs.subscribe(viewModel => {
      this.viewModel = viewModel;
      this.viewModel.content = new QuillDeltaToHtmlConverter(JSON.parse(this.viewModel.content)).convert();
    });
  }
}
