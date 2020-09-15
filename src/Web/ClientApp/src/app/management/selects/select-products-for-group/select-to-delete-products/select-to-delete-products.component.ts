import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {Page} from '../../../../../models/Page';
import {Product} from '../../../../../models/product/Product';
import {SelectionModel} from '@angular/cdk/collections';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../../../services/product.service';
import {Sort} from '@angular/material/sort';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MatDialog} from '@angular/material/dialog';
import {DeleteCommonModalComponent} from '../../../../shop/delete-common-modal/delete-common-modal.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-select-to-delete-products',
  templateUrl: './select-to-delete-products.component.html',
  styleUrls: ['./select-to-delete-products.component.scss']
})
export class SelectToDeleteProductsComponent implements OnInit, AfterViewInit {

  isLoading = false;

  @Input()
  searchTitle: string;
  @Input()
  products: Product[] = [];
  @Input()
  sortTitle = null;
  page: Page<Product>;
  selection: SelectionModel<Product> = new SelectionModel<Product>(true, []);
  @Output()
  deleted: EventEmitter<Product[]> = new EventEmitter<Product[]>();

  @ViewChild('paginator')
  private paginator: MatPaginator;
  @ViewChild('selectionList')
  private selectionList: MatSelectionList;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  createPage(products: Product[], pageIndex: number, pageSize: number = 10): Page<Product> {
    const totalPages = Math.trunc(Math.ceil(products.length / pageSize));
    const skip = (pageIndex - 1) * pageSize;
    const take = skip + pageSize;
    return {
      hasNextPage: pageIndex < totalPages,
      hasPreviousPage: pageIndex > 1,
      items: products.slice(skip, take),
      pageIndex: pageIndex,
      totalItems: products.length,
      totalPages: Math.trunc(Math.ceil(products.length / pageSize)),
    };
  }

  loadPage(pageIndex: number = 1): void {
    if (this.products.length > 0) {
      let products = this.products;
      if (this.searchTitle) {
        products = products.filter(a => a.name.toLocaleLowerCase()
          .includes(this.searchTitle.toLocaleLowerCase()));
      }
      if (this.sortTitle) {
        products = products.sort((a, b) =>
          this.sortTitle === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
      }
      this.page = this.createPage(products, pageIndex);
      this.initPaginator(this.page);
    } else {
      this.page = null;
    }
  }

  sortChange(sort: Sort) {
    if (sort.active === 'title') {
      this.sortTitle = sort.direction === '' ? null : sort.direction;
      this.loadPage(this.page.pageIndex);
    }
  }

  pageAllCheckChange($event: MatCheckboxChange): void {
    const checked = $event.checked;
    if (checked) {
      this.selectionList.selectAll();
      this.selection.select(...this.page.items);
    } else {
      const toUncheckItems = this.selection.selected.filter(a => this.page.items.some(b => b.id === a.id));
      this.selectionList.deselectAll();
      this.selection.deselect(...toUncheckItems);
    }
  }

  selectionChange($event: MatSelectionListChange) {
    if ($event.option.selected) {
      this.selection.select(...[$event.option.value]);
    } else {
      const val = this.selection.selected.find(p => p.id === $event.option.value.id);
      this.selection.deselect(...[val]);
    }
  }

  isAllChecked(items: Product[]): boolean {
    return items.every(a => this.selection.selected.some(b => b.id === a.id));
  }

  someCheckedExceptAll(items: Product[]): boolean {
    return items.some(a => this.selection.selected.some(b => b.id === a.id))
      && !this.isAllChecked(items);
  }

  someChecked(items: Product[]): boolean {
    return items.some(a => this.selection.selected.some(b => b.id === a.id));
  }

  isSelected(product: Product): boolean {
    return this.selection.selected.some(a => a.id === product.id);
  }

  paginationChange($event: PageEvent) {
    this.loadPage($event.pageIndex + 1);
  }

  removeClick() {
    this.openDeleteDialog();
  }

  private initPaginator(page: Page<any>) {
    this.paginator.length = page.totalItems;
    this.paginator.pageIndex = page.pageIndex - 1;
    this.paginator.disabled = false;
  }

  private deleteSelected() {
    this.products = this.products.filter(p => !this.selection.selected.some(s => s.id === p.id));
    this.selection.clear();
    this.page = this.createPage(this.products, 1);
    this.deleted.emit(this.products);
    this.showDeleteSuccessSnackbar();
  }

  private openDeleteDialog() {
    const dialogRef = this._dialog.open(DeleteCommonModalComponent, {
      data: `Удалить выбранные элементы(${this.selection.selected.length})?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteSelected();
      }
    });
  }

  private showDeleteSuccessSnackbar() {
    this._snackBar.open('Все выбранные элементы удалены успешно.', null, {duration: 3000});
  }
}
