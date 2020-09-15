import {Component, Input, OnInit} from '@angular/core';
import {ProductSpec} from '../../../../models/product/ProductSpec';
import {Product} from '../../../../models/product/Product';
import {ProductService} from '../../../../services/product.service';

@Component({
  selector: 'app-select-specifications',
  templateUrl: './select-specifications.component.html',
  styleUrls: ['./select-specifications.component.scss']
})
export class SelectSpecificationsComponent implements OnInit {

  isLoading = false;

  constructor(private _productService: ProductService) {
  }

  private _product: Product;

  @Input()
  set product(product: Product) {
    if (product) {
      this._product = product;
      this.isLoading = true;
      this._productService.getProductSpecifications(product.id)
        .subscribe(specs => {
          this._source = [...specs];
          this._modified = [...specs];
        }).add(() => this.isLoading = false);
    }
  }

  private _source: ProductSpec[];

  get source(): ProductSpec[] {
    return this._modified;
  }

  private _modified: ProductSpec[] = [];

  get modified(): ProductSpec[] {
    return this._modified;
  }

  get hasSource(): boolean {
    return this._source && this._source.length > 0;
  }

  get canBeRestored(): boolean {
    return this.hasSource && this._source.some(a => a.productSpecNameId !== a.productSpecNameId || a.value !== a.value);
  }

  ngOnInit(): void {
  }

  isModified(spec: ProductSpec): boolean {
    const sourceItem = this._source.find(a => a.id === spec.id);
    return sourceItem.productSpecNameId !== spec.productSpecNameId || sourceItem.value !== spec.value;
  }

  addClick() {
    this.modified.push(new ProductSpec(0, '', '', this._product?.id || 0));
  }

  removeClick(spec: ProductSpec) {
    this._modified = this._modified?.filter(a => a !== spec);
  }

  restoreClick() {
    this._modified = [...this._source];
  }

  emptyClick() {
    this._modified = [];
  }
}
