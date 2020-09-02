export class Order {
  constructor(
    public id?: number,
    public date?: string,
    public comment?: string,
    public status?: DeliveryStatus,
    public buyerId?: number,
    public addressId?: number) {
  }
}

export enum DeliveryStatus {
  Statement,
  InTransit,
  Delivered,
  Canceled
}
