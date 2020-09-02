import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Page} from '../../../../models/Page';
import {Catalog} from '../../../../models/catalog/Catalog';
import {SelectionModel} from '@angular/cdk/collections';
import {ActivatedRoute, Router} from '@angular/router';
import {CatalogService} from '../../../../services/catalog.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Sort} from '@angular/material/sort';
import {DeleteCommonModalComponent} from '../../../shop/delete-common-modal/delete-common-modal.component';
import {debounceTime, map} from 'rxjs/operators';
import {CatalogWithParents} from '../../../../models/catalog/CatalogWithParents';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CatalogListComponent implements OnInit, AfterViewInit {

  isLoading = false;

  @ViewChild('paginator')
  paginator: MatPaginator;

  page: Page<CatalogWithParents>;
  sortTitle = '';
  searchTitle = '';

  searchSubject: Subject<string> = new Subject<string>().pipe(debounceTime(500)) as Subject<string>;

  selection = new SelectionModel<Catalog>(true, []);

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
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

  isAllOnPageSelected(): boolean {
    return this.page && this.page.items.every(a => this.selection.selected.some(b => b.id === a.id));
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

  hasPageItems(): boolean {
    return this.page?.items?.length > 0;
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
    this._catalogService.deleteCatalogs(ids).subscribe(() => {
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

  isSelected(catalog: Catalog): boolean {
    return this.selection.selected.some(a => a.id === catalog.id);
  }

  selectChange(checked: boolean, catalog: Catalog): void {
    if (checked) {
      this.selection.select(catalog);
    } else {
      this.selection.deselect(this.selection.selected.find(a => a.id === catalog.id));
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
    this._catalogService.getCatalogsPage(page, this.sortTitle, this.searchTitle)
      .pipe(map(a => {
        const catalogWithParents = a.items.map(cat => {
          const items = new CatalogWithParents(cat.id, cat.title, cat.parentCatalogId);
          if (cat.parentCatalogId) {
            items.parents$ = this._catalogService.parentsFor(items.id)
              .pipe(
                map((parents: Catalog[]) => parents.reverse()),
                map((parents: Catalog[]) => (items.parents = parents)));
          }
          return items;
        });
        return new Page(catalogWithParents, a.pageNumber, a.totalPages, a.totalItems, a.hasPreviousPage, a.hasNextPage);
      }))
      .subscribe((pageWithParents: Page<CatalogWithParents>) => {
        this.page = pageWithParents;
        this.initPaginator(pageWithParents);
      }).add(() => this.isLoading = false);
  }

  private initPaginator(page: Page<any>): void {
    this.paginator.length = page.totalItems;
    this.paginator.pageIndex = page.pageNumber - 1;
  }
}
