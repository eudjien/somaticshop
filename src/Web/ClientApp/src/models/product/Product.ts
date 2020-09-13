export class Product {
  constructor(
    public id = 0,
    public name?: string,
    public content?: string,
    public description?: string,
    public price?: number,
    public catalogId?: number,
    public brandId?: number,
    public groupId?: number) {
  }
}
