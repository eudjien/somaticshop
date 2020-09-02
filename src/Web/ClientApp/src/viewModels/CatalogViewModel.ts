export class CatalogViewModel {
  constructor(
    public id?: number,
    public title?: string,
    public imageUrl?: string,
    public parentCatalogs?: CatalogViewModel[]) {
  }
}
