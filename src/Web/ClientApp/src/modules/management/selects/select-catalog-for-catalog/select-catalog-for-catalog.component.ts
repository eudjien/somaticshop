import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Page} from '../../../../models/Page';
import {Catalog} from '../../../../models/catalog/Catalog';
import {ActivatedRoute, Router} from '@angular/router';
import {CatalogService} from '../../../../services/catalog.service';
import {Sort} from '@angular/material/sort';
import {map} from 'rxjs/operators';
import {MatSelectionListChange} from '@angular/material/list';
import {CatalogWithParents} from '../../../../models/catalog/CatalogWithParents';

@Component({
  selector: 'app-select-catalog-for-catalog',
  templateUrl: './select-catalog-for-catalog.component.html',
  styleUrls: ['./select-catalog-for-catalog.component.scss']
})
export class SelectCatalogForCatalogComponent implements OnInit, AfterViewInit {

  isLoading = false;
  page: Page<CatalogWithParents>;
  sortTitle = '';
  searchTitle = '';

  @ViewChild('paginator')
  private paginator: MatPaginator;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _catalogService: CatalogService) {
  }

  private _selected: CatalogWithParents;

  get selected(): CatalogWithParents {
    return this._selected;
  }

  private _source: Catalog;

  get source(): Catalog {
    return this._source;
  }

  get hasSelected(): boolean {
    return !!this.selected;
  }

  get isModified(): boolean {
    return this._selected?.id !== this._source?.id;
  }

  get hasSource(): boolean {
    return !!this._source;
  }

  get canBeRestored(): boolean {
    return this.hasSource && this.selected?.id !== this._source.parentCatalogId;
  }

  set catalog(catalog: Catalog) {
    this._source = catalog;
    if (catalog.parentCatalogId) {
      this._catalogService.catalogById(catalog.parentCatalogId)
        .subscribe(parentCatalog => {

          this._selected = new CatalogWithParents(
            parentCatalog.id,
            parentCatalog.title,
            parentCatalog.parentCatalogId);

          this._selected.parents$ = this._catalogService.parentsFor(this._selected.id)
            .pipe(map((parents: Catalog[]) => (this._selected.parents = parents.reverse())));
        });
    }
  }

  isSelected(catalog: Catalog): boolean {
    return this.hasSelected && this._selected.id === catalog.id;
  }

  isSource(catalog: Catalog): boolean {
    return this.hasSource && catalog.id === this._source.id;
  }

  ngOnInit(): void {
    this.loadPage(1);
  }

  ngAfterViewInit(): void {
  }

  restoreClick() {
    this.catalog = this._source;
  }

  emptyClick() {
    this._selected = null;
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
        this.paginator.length = pageWithParents.totalItems;
        this.paginator.pageIndex = pageWithParents.pageNumber - 1;
      }).add(() => this.isLoading = false);
  }
}
