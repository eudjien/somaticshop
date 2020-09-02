import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../../services/product.service';
import {Product} from '../../../models/product/Product';
import {EditorComponent} from '../editor/editor.component';
import {UploadImageMultiComponent} from '../upload-image-multi/upload-image-multi.component';
import {SelectCatalogForCatalogComponent} from '../selects/select-catalog-for-catalog/select-catalog-for-catalog.component';
import {SelectGroupForProductComponent} from '../selects/select-group-for-product/select-group-for-product.component';
import {SelectSpecificationsComponent} from '../selects/select-specifications/select-specifications.component';
import {ProductSpec} from '../../../models/product/ProductSpec';
import {SelectBrandForProductComponent} from '../selects/select-brand-for-product/select-brand-for-product.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-product-new',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductNewComponent implements OnInit, AfterViewInit {

  isLoading = false;

  formGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
  });

  @ViewChild('editor')
  editor: EditorComponent;
  @ViewChild('uploadImage')
  uploadImage: UploadImageMultiComponent;
  @ViewChild('selectCatalogForProduct')
  selectCatalogForProduct: SelectCatalogForCatalogComponent;
  @ViewChild('selectGroupForProduct')
  selectGroupForProduct: SelectGroupForProductComponent;
  @ViewChild('selectSpecificationsForProduct')
  selectSpecsForProduct: SelectSpecificationsComponent;
  @ViewChild('selectBrandForProduct')
  selectBrandForProduct: SelectBrandForProductComponent;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _productService: ProductService,
    private _snackBar: MatSnackBar) {
  }

  getErrorMessage() {
    if (this.formGroup.hasError('required')) {
      return 'Это поле обязательное для заполнения';
    } else {
      return '';
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  sendClick() {
    const product: Product = {
      id: 0,
      title: this.formGroup.get('title').value,
      content: this.editor.stringify(),
      description: this.formGroup.get('description').value,
      price: this.formGroup.get('price').value,
      catalogId: this.selectCatalogForProduct.selected?.id,
      brandId: this.selectBrandForProduct.selected?.id,
      groupId: this.selectGroupForProduct.selected?.id
    };
    this.createRequest(product, this.uploadImage.images.map(a => a.file), this.selectSpecsForProduct.modified);
  }

  private createRequest(product: Product, imageFiles?: File[], specifications?: ProductSpec[]) {
    this.isLoading = true;
    this._productService.createProduct(product, imageFiles, specifications).subscribe(newProduct => {
      this.showSuccessSnackbar();
      this._router.navigate([`../${newProduct.id}/edit`], {relativeTo: this._route});
    }, error => {

    }).add(() => this.isLoading = false);
  }

  private showSuccessSnackbar(): void {
    this._snackBar.open('Продукт успешно создан', null, {duration: 3500});
  }
}
