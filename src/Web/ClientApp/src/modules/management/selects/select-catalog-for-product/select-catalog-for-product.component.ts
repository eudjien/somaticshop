import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Page} from '../../../../models/Page';
import {Catalog} from '../../../../models/catalog/Catalog';
import {ActivatedRoute, Router} from '@angular/router';
import {CatalogService} from '../../../../services/catalog.service';
import {Sort} from '@angular/material/sort';
import {map} from 'rxjs/operators';
import {MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {Product} from '../../../../models/product/Product';
import {CatalogWithParents} from '../../../../models/catalog/CatalogWithParents';

@Component({
  selector: 'app-select-catalog-for-product',
  templateUrl: './select-catalog-for-product.component.html',
  styleUrls: ['./select-catalog-for-product.component.scss']
})
export class SelectCatalogForProductComponent implements OnInit, AfterViewInit {

  isLoading = false;
  page: Page<CatalogWithParents>;
  sortTitle = '';
  searchTitle = '';

  @ViewChild('paginator')
  private paginator: MatPaginator;
  @ViewChild('selectionList')
  private selectionList: MatSelectionList;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _catalogService: CatalogService) {
  }

  private _selected: CatalogWithParents;

  get selected(): CatalogWithParents {
    return this._selected;
  }

  set selected(catalog: CatalogWithParents) {
    this._selected = catalog;
  }

  private _source: CatalogWithParents;

  get source(): CatalogWithParents {
    return this._source;
  }

  get isModified(): boolean {
    return this._selected?.id !== this._source?.id;
  }

  get hasSource(): boolean {
    return !!this._source;
  }

  get hasSelected(): boolean {
    return !!this.selected;
  }

  get canBeRestored(): boolean {
    return this.hasSource && this.selected?.id !== this.source.id;
  }

  set product(product: Product) {
    if (product.catalogId) {
      const existCatalog = this.page?.items.find(a => a.id === product.catalogId);
      if (existCatalog) {
        this._source = existCatalog;
        this._selected = existCatalog;
      } else {
        this._catalogService.catalogById(product.catalogId)
          .subscribe(catalog => {

            this._selected =
              new CatalogWithParents(catalog.id, catalog.title, catalog.parentCatalogId);

            this._selected.parents$ = this._catalogService.parentsFor(catalog.id)
              .pipe(map(parents => (this._selected.parents = parents.reverse())));

            this._source = this._selected;
          });
      }
    }
  }

  isSource(catalog: Catalog): boolean {
    return this.hasSource && catalog.id === this._source.id;
  }

  isSelected(catalog: Catalog): boolean {
    return this.hasSelected && this._selected.id === catalog.id;
  }

  ngOnInit(): void {
    this.loadPage(1);
  }

  ngAfterViewInit(): void {
  }

  restoreClick() {
    this._selected = this._source;
  }

  emptyClick() {
    this.selected = null;
    // this.selectionList.deselectAll();
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

  searchChange($event: string) {
    this.searchTitle = $event;
    this.loadPage(this.page.pageNumber);
  }

  selectionChange($event: MatSelectionListChange) {
    this._selected = $event.option.value;
  }

  private loadPage(page: number): void {
    this.isLoading = true;
    this._catalogService.getCatalogsPage(page, this.sortTitle, this.searchTitle)
      .pipe(map(a => {
        const catalogsWithParents = a.items.map(cat => {
          const items = new CatalogWithParents(cat.id, cat.title, cat.parentCatalogId);
          if (cat.parentCatalogId) {
            items.parents$ = this._catalogService.parentsFor(items.id)
              .pipe(map((parents: Catalog[]) => (items.parents = parents.reverse())));
          }
          return items;
        });
        return new Page(catalogsWithParents, a.pageNumber, a.totalPages, a.totalItems, a.hasPreviousPage, a.hasNextPage);
      }))
      .subscribe((pageWithParents: Page<CatalogWithParents>) => {
        this.page = pageWithParents;
        this.initPagination(pageWithParents);
      }).add(() => this.isLoading = false);
  }

  private initPagination(page: Page<any>): void {
    this.paginator.length = page.totalItems;
    this.paginator.pageIndex = page.pageNumber - 1;
  }
}
