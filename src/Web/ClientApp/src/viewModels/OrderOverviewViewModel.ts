import {DeliveryStatus} from '../models/order/Order';

export class OrderOverviewViewModel {
  constructor(
    public id?: number,
    public date?: string,
    public comment?: string,
    public buyerId?: number,
    public addressId?: number,
    public status?: DeliveryStatus) {
  }
}
