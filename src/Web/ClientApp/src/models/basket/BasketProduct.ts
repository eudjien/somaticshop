export class BasketProduct {
  constructor(
    public basketId: number,
    public productId: number,
    public unitPrice: number,
    public quantity: number) {
  }
}
