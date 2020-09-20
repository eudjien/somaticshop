import {AfterViewInit, Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import {ProductService} from '../../../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../../../models/product/Product';
import {FileService} from '../../../services/file.service';
import {DOCUMENT} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {ProductSpecification} from '../../../models/product/ProductSpecification';
import {BrandService} from '../../../services/brand.service';
import {CatalogService} from '../../../services/catalog.service';
import {ProductDetailsViewModel} from '../../../viewModels/ProductDetailsViewModel';
import {CatalogCard} from '../../../viewModels/CatalogCard';
import {ProductCard} from '../../../viewModels/ProductCard';
import {QuillDeltaToHtmlConverter} from 'quill-delta-to-html';
import {zip} from 'rxjs';
import {AccountService} from '../../../services/account.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {

  isLoading = false;
  specsDataSource: MatTableDataSource<ProductSpecification>;
  specsDisplayedColumns = ['name', 'value'];
  viewModel: ProductDetailsViewModel;
  selectedProduct: ProductCard;
  @ViewChild('images') images: ElementRef<HTMLElement>;
  @ViewChildren('images')
  imagesQueryList: QueryList<ElementRef<HTMLElement>>;

  constructor(
    private _productService: ProductService,
    private _brandService: BrandService,
    private _catalogService: CatalogService,
    private _accountService: AccountService,
    private _fileService: FileService,
    private _route: ActivatedRoute,
    private _router: Router,
    @Inject(DOCUMENT) private document) {
    _route.params.subscribe(params => this.load(+params['id']));
  }

  private static createFotoramaScript(): HTMLScriptElement {
    const scriptElem: HTMLScriptElement = document.createElement('script');
    scriptElem.id = 'fotoramaScript';
    scriptElem.src = '../assets/fotorama/fotorama.js';
    scriptElem.type = 'text/javascript';
    return scriptElem;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  compareProduct(a: Product, b: Product): boolean {
    return a.id === b.id;
  }

  selectChange($product: Product) {
    if (!this.compareProduct($product, this.viewModel)) {
      this._router.navigate([`products`, $product.id])
        .then(redirected => {
          // if (redirected) {
          //   // this.reset();
          //   this.load($product.id);
          // }
        });
    }
  }

  private createFotorama(...urls: string[]): HTMLDivElement {
    const divElem: HTMLDivElement = document.createElement('div');
    divElem.style.height = '0px';

    divElem.id = 'fotorama';
    divElem.classList.add('fotorama');
    divElem.setAttribute('data-nav', 'thumbs');
    divElem.setAttribute('data-allowfullscreen', 'true');
    divElem.setAttribute('data-auto', 'true');
    divElem.setAttribute('data-minheight', '280px');
    urls.forEach(url => {
      const imgElem: HTMLImageElement = document.createElement('img');
      imgElem.src = url;
      imgElem.alt = '';
      divElem.appendChild(imgElem);
    });

    setTimeout(() => {
      divElem.style.height = '';
    }, 100);

    return divElem;
  }

  private load(productId: number): void {

    this._productService.getProductById(productId).subscribe(product => {
      const viewModel: ProductDetailsViewModel = product;

      viewModel.content = new QuillDeltaToHtmlConverter(JSON.parse(product.content)).convert();

      zip(
        this._productService.getProductImageUrls(product.id),
        this._productService.productSpecifications(productId),
        this._catalogService.parentsFor(product.catalogId, true),
        this._productService.getGroupProducts(product.groupId),
        zip(this._brandService.getBrandById(product.brandId), this._brandService.getBrandImageUrl(product.brandId))
      ).subscribe(([productImageUrls, specs, catalogs, productsInGroup, brandAndImage]) => {
        console.log(specs);
        if (specs) {
          viewModel.specifications = specs;
          this.specsDataSource = new MatTableDataSource<ProductSpecification>(specs);
        }

        if (catalogs) {
          viewModel.catalogs = catalogs.map(a => new CatalogCard(a.id, a.name)).reverse();
          viewModel.catalogs.forEach(catalog => {
            this._catalogService.getCatalogImageUrl(catalog.id)
              .subscribe(catalogImageUrl => {
                catalog.imageUrl = catalogImageUrl;
              });
          });
        }

        if (productsInGroup && productsInGroup.length) {
          viewModel.productsInGroup = productsInGroup.map(groupProduct =>
            new ProductCard(groupProduct.id, groupProduct.name, groupProduct.description, groupProduct.price));
          this.selectedProduct = viewModel.productsInGroup.find(a => this.compareProduct(a, product));
          viewModel.productsInGroup.forEach(productInGroup => {
            this._productService.productThumbnailUrl(productInGroup.id)
              .subscribe(productInGroupImageUrl => {
                productInGroup.imageUrl = productInGroupImageUrl;
              });
          });
        }

        if (brandAndImage) {
          viewModel.brand = brandAndImage[0];
          viewModel.brand.imageUrl = brandAndImage[1];
        }

        if (brandAndImage) {
          viewModel.imagesUrls = productImageUrls;
          this.imagesQueryList.changes.subscribe(() => {
            this.initImagesScript(...productImageUrls);
          });
        }

        this.viewModel = viewModel;
      });
    });
  }

  private initImagesScript(...urls: string[]) {
    const oldFotoramaScript = this.document.head.querySelector('#fotoramaScript');
    const newFotoramaScript = ProductDetailsComponent.createFotoramaScript();
    if (oldFotoramaScript) {
      this.document.head.replaceChild(newFotoramaScript, oldFotoramaScript);
    } else {
      this.document.head.appendChild(newFotoramaScript);
    }
    const oldFotorama = this.images.nativeElement.querySelector('#fotorama');
    const newFotorama = this.createFotorama(...urls);
    if (oldFotorama) {
      this.images.nativeElement.replaceChild(newFotorama, oldFotorama);
    } else {
      this.images.nativeElement.appendChild(newFotorama);
    }
  }
}
