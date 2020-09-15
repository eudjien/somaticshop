import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ProductGroup} from '../../../models/product/ProductGroup';
import {ProductService} from '../../../services/product.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SelectProductsForGroupComponent} from '../selects/select-products-for-group/select-products-for-group.component';

@Component({
  selector: 'app-product-group-new',
  templateUrl: './product-group-edit.component.html',
  styleUrls: ['./product-group-edit.component.scss'],
})
export class ProductGroupNewComponent implements OnInit, AfterViewInit, AfterViewChecked {

  isLoading = false;

  @ViewChild('listSelectProducts')
  listSelectProducts: SelectProductsForGroupComponent;

  name = new FormControl('', [Validators.required]);

  constructor(
    private _productService: ProductService,
    private _router: Router,
    private _snackbar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.listSelectProducts.init(null);
  }

  ngAfterViewChecked(): void {
  }

  sendClick() {
    const productGroup: ProductGroup = {
      id: 0,
      name: this.name.value,
    };
    const productIds = this.listSelectProducts.selectedItems.map(p => p.id);
    this.createReq(productGroup, productIds);
  }

  private createReq(productGroup: ProductGroup, productIds?: number[]) {
    this.isLoading = true;
    this._productService.createProductGroup(productGroup, productIds)
      .subscribe(newProductGroup => {
        this._router.navigateByUrl(`mgmt/product-groups/${newProductGroup.id}/edit`).catch();
        this._snackbar.open('Группа успешно создана!', null, {duration: 3000});
      }, error => {

      }).add(() => this.isLoading = false);
  }

  private verify(): boolean {

    if (!this.name.valid) {
      // this.title.setErrors(this.title.errors);
      return false;
    }

    return true;
  }
}
