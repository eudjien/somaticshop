import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Page} from '../../../../models/Page';
import {SelectionModel} from '@angular/cdk/collections';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Sort} from '@angular/material/sort';
import {DeleteCommonModalComponent} from '../../../shop/delete-common-modal/delete-common-modal.component';
import {Product} from '../../../../models/product/Product';
import {ProductService} from '../../../../services/product.service';
import {ProductWithCatalogs} from '../../../../models/product/ProductWithCatalogs';
import {debounceTime, map} from 'rxjs/operators';
import {CatalogService} from '../../../../services/catalog.service';
import {Subject} from 'rxjs';
import {ProductSearchModel} from '../../../../models/search/ProductSearchModel';

@Component({
  selector: 'app-catalog-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, AfterViewInit {

  isLoading = false;

  @ViewChild('paginator')
  paginator: MatPaginator;

  page: Page<ProductWithCatalogs>;
  sortTitle = '';
  searchTitle = '';

  searchSubject: Subject<string> = new Subject<string>().pipe(debounceTime(500)) as Subject<string>;

  selection = new SelectionModel<Product>(true, []);

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService,
    private _catalogService: CatalogService,
    public _dialog: MatDialog,
    public _snackBar: MatSnackBar) {
    this.searchSubject.subscribe(value => {
      this.searchTitle = value;
      this.loadPage(this.page.pageNumber);
    });
  }

  ngOnInit(): void {
    this.loadPage(1);
  }

  hasPageItems(): boolean {
    return this.page?.items?.length > 0;
  }

  paginationChange(pageEvent: PageEvent) {
    this.loadPage(pageEvent.pageIndex + 1);
  }

  sortChange(sort: Sort) {
    if (sort.active === 'title') {
      this.sortTitle = sort.direction === '' ? null : sort.direction;
      this.loadPage(this.page.pageNumber);
    }
  }

  ngAfterViewInit(): void {
  }

  deleteClick($event: MouseEvent) {
    this.openDeleteDialog();
  }

  openDeleteDialog(): void {
    const isOne = this.selection.selected.length === 1;
    const dialogRef = this._dialog.open(DeleteCommonModalComponent, {
      data: `Удалить ${isOne ? `каталог '${this.selection.selected[0].title}'` : `каталоги (${this.selection.selected.length})`}?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteSelected();
      }
    });
  }

  deleteSelected(): void {
    this.isLoading = true;
    const ids = this.selection.selected.map(a => a.id);
    this._productService.deleteProducts(ids).subscribe(() => {
      this.showDeleteSuccessSnackbar();
      this.selection.clear();
      this.loadPage(this.page.pageNumber);
    }).add(() => this.isLoading = false);
  }

  showDeleteSuccessSnackbar() {
    this._snackBar.open('Удаление успешно выполнено!', null, {
      duration: 3500,
      verticalPosition: 'bottom',
    });
  }

  searchChange($event: string) {
    this.searchSubject.next($event);
  }

  selectChange(checked: boolean, product: Product): void {
    if (checked) {
      this.selection.select(product);
    } else {
      this.selection.deselect(this.selection.selected.find(a => a.id === product.id));
    }
  }

  pageSelectChange(checked: boolean): void {
    if (checked) {
      this.selection.select(...this.page.items.filter(a => !this.selection.selected.some(b => b.id === a.id)));
    } else {
      this.selection.deselect(...this.selection.selected.filter(a => this.page.items.some(b => b.id === a.id)));
    }
  }

  someOnPageSelected(): boolean {
    return this.page && this.page.items.some(a => this.selection.selected.some(b => b.id === a.id)) && !this.isAllOnPageSelected();
  }

  isAllOnPageSelected(): boolean {
    return this.page && this.page.items.every(a => this.selection.selected.some(b => b.id === a.id));
  }

  isSelected(product: Product): boolean {
    return this.selection.selected.some(a => a.id === product.id);
  }

  private loadPage(page: number): void {
    this.isLoading = true;

    const searchModel = new ProductSearchModel();
    searchModel.titles = this.searchTitle ? [this.searchTitle] : null;

    this._productService.getProductsPage(
      page,
      this.sortTitle ? new Map<string, string>([['title', this.sortTitle]]) : null,
      searchModel)
      .pipe(map(productPage => {
        const items = productPage.items
          .map(p => {
            const productWithCatalogs =
              new ProductWithCatalogs(p.id, p.title, p.content, p.description, p.price, p.catalogId, p.brandId, p.groupId);
            productWithCatalogs.catalogs$ = this._catalogService.parentsFor(p.catalogId, true)
              .pipe(map(a => (productWithCatalogs.catalogs = a.reverse())));
            return productWithCatalogs;
          });
        return new Page(items,
          productPage.pageNumber,
          productPage.totalPages,
          productPage.totalItems,
          productPage.hasPreviousPage,
          productPage.hasNextPage);
      }))
      .subscribe(productsPage => {
        this.page = productsPage;
        this.initPaginator(productsPage);
      }).add(() => this.isLoading = false);
  }

  private initPaginator(page: Page<any>): void {
    this.paginator.length = page.totalItems;
    this.paginator.pageIndex = page.pageNumber - 1;
  }
}
