import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Page} from '../../../../models/Page';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {Sort} from '@angular/material/sort';
import {DeleteCommonModalComponent} from '../../../shop/delete-common-modal/delete-common-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProductService} from '../../../../services/product.service';
import {GroupWithProducts} from '../../../../models/GroupWithProducts';
import {debounceTime, map} from 'rxjs/operators';
import {ProductGroup} from '../../../../models/product/ProductGroup';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-product-group-list',
  templateUrl: './product-group-list.component.html',
  styleUrls: ['./product-group-list.component.scss']
})
export class ProductGroupListComponent implements OnInit, AfterViewInit {

  searchSubject: Subject<string> = new Subject<string>().pipe(debounceTime(500)) as Subject<string>;

  isLoading = false;

  @ViewChild('paginator')
  paginator: MatPaginator;

  page: Page<GroupWithProducts>;
  sortTitle = '';
  searchTitle = '';

  selection = new SelectionModel<ProductGroup>(true, []);

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar) {
    this.searchSubject.subscribe(value => {
      this.searchTitle = value;
      this.loadPage(this.page.pageIndex);
    });
  }

  ngOnInit(): void {
    this.loadPage(1);
  }

  hasPageItems(): boolean {
    return this.page?.items?.length > 0;
  }

  isAllOnPageSelected(): boolean {
    return this.page && this.page.items.every(a => this.selection.selected.some(b => b.id === a.id));
  }

  paginationChange(pageEvent: PageEvent) {
    this.loadPage(pageEvent.pageIndex + 1);
  }

  sortChange(sort: Sort) {
    if (sort.active === 'title') {
      this.sortTitle = sort.direction === '' ? null : sort.direction;
      this.loadPage(this.page.pageIndex);
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
      data: `Удалить ${isOne ? `каталог '${this.selection.selected[0].name}'` : `каталоги (${this.selection.selected.length})`}?`
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
    this._productService.deleteProductGroups(ids).subscribe(() => {
      this.showDeleteSuccessSnackbar();
      this.selection.clear();
      this.loadPage(this.page.pageIndex);
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

  isSelected(group: ProductGroup): boolean {
    return this.selection.selected.some(a => a.id === group.id);
  }

  selectChange(checked: boolean, group: ProductGroup): void {
    if (checked) {
      this.selection.select(group);
    } else {
      this.selection.deselect(this.selection.selected.find(a => a.id === group.id));
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

  private loadPage(page: number): void {
    this.isLoading = true;
    this._productService.getProductGroupsPage(page, this.sortTitle, this.searchTitle)
      .pipe(map(groupPage => {
        const groupWithProducts = groupPage.items.map(group => {
          const item = new GroupWithProducts(group.id, group.name);
          item.products$ = this._productService.getGroupProducts(item.id);
          return item;
        });
        return new Page(
          groupWithProducts, groupPage.pageIndex,
          groupPage.totalPages, groupPage.totalItems,
          groupPage.hasPreviousPage, groupPage.hasNextPage);
      }))
      .subscribe((pageWithParents: Page<GroupWithProducts>) => {
        this.page = pageWithParents;
        this.initPaginator(pageWithParents);
      }).add(() => this.isLoading = false);
  }

  private initPaginator(page: Page<any>): void {
    this.paginator.length = page.totalItems;
    this.paginator.pageIndex = page.pageIndex - 1;
  }
}
