import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ProductGroup} from '../../../models/product/ProductGroup';
import {ProductService} from '../../../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SelectProductsForGroupComponent} from '../selects/select-products-for-group/select-products-for-group.component';
import {Page} from '../../../models/Page';
import {ProductSearchModel} from '../../../models/search/ProductSearchModel';

@Component({
  selector: 'app-edit-product-group',
  templateUrl: './product-group-edit.component.html',
  styleUrls: ['./product-group-edit.component.scss']
})
export class EditProductGroupComponent implements OnInit, AfterViewInit {

  isLoading = false;

  @ViewChild('listSelectProducts')
  listSelectProducts: SelectProductsForGroupComponent;

  id: number = +this._route.snapshot.paramMap.get('id');
  page: Page<ProductGroup>;

  title = new FormControl('', [Validators.required]);

  constructor(
    private _productService: ProductService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _snackbar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.loadReq(this.id);
  }

  ngAfterViewInit(): void {
  }

  sendClick() {
    const productGroup: ProductGroup = {
      id: this.id,
      title: this.title.value,
    };
    const productIds = this.listSelectProducts.selectedItems.map(p => p.id);
    this.updateReq(productGroup, productIds);
  }

  private loadReq(id: number) {
    this.isLoading = true;
    this._productService.getProductGroupById(id)
      .subscribe((productGroup: ProductGroup) => {

        this.title.setValue(productGroup.title);

        const searchModel = new ProductSearchModel();
        searchModel.groupIds = [productGroup.id];

        this._productService.getProducts(searchModel)
          .subscribe(products => {
            this.listSelectProducts.init(productGroup);
          });

      }).add(() => this.isLoading = false);
  }

  private updateReq(productGroup: ProductGroup, productIds?: number[]) {
    this.isLoading = true;
    this._productService.updateProductGroup(productGroup, productIds)
      .subscribe(updatedProductGroup => {
        this._router.navigateByUrl(`mgmt/product-groups/${updatedProductGroup.id}/edit`).catch();
        this._snackbar.open('Группа успешно обновлена!', null, {duration: 3000});
      }, error => {

      }).add(() => this.isLoading = false);
  }
}
