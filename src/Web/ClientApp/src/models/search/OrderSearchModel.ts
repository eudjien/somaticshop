import {DeliveryStatus} from '../order/Order';

export class OrderSearchModel {
  constructor(
    public ids?: number[],
    public comments?: string[],
    public statuses?: DeliveryStatus[],
    public buyerIds?: number[],
    public addressIds?: number[],
    public userOrAnonymousIds?: string[],
  ) {
  }
}
