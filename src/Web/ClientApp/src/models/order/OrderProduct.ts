export class OrderProduct {
  constructor(
    public orderId?: number,
    public productId?: number,
    public unitPrice?: number,
    public quantity?: number
  ) {
  }
}
