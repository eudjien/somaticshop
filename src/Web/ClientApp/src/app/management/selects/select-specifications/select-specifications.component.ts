import {Component, Input, OnInit} from '@angular/core';
import {ProductSpecification} from '../../../../models/product/ProductSpecification';
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
      this._productService.productSpecifications(product.id)
        .subscribe(specs => {
          this._source = [...specs];
          this._modified = [...specs];
        }).add(() => this.isLoading = false);
    }
  }

  private _source: ProductSpecification[];

  get source(): ProductSpecification[] {
    return this._modified;
  }

  private _modified: ProductSpecification[] = [];

  get modified(): ProductSpecification[] {
    return this._modified;
  }

  get hasSource(): boolean {
    return this._source && this._source.length > 0;
  }

  get canBeRestored(): boolean {
    return this.hasSource && this._source.some(a => a.nameId !== a.nameId || a.value !== a.value);
  }

  ngOnInit(): void {
  }

  isModified(spec: ProductSpecification): boolean {
    const sourceItem = this._source.find(a => a.id === spec.id);
    return sourceItem.nameId !== spec.nameId || sourceItem.value !== spec.value;
  }

  addClick() {
    this.modified.push(new ProductSpecification(0, '', '', this._product?.id || 0));
  }

  removeClick(spec: ProductSpecification) {
    this._modified = this._modified?.filter(a => a !== spec);
  }

  restoreClick() {
    this._modified = [...this._source];
  }

  emptyClick() {
    this._modified = [];
  }
}
