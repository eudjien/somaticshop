import {DeliveryStatus} from './models/order/Order';

export class AppConstants {
  public static readonly CURRENCY = 'BYN';
  public static readonly BASKET_COOKIE_NAME = 'USER_BASKET';

  public static GetOrderStatus(status: DeliveryStatus): string {
    switch (status) {
      case DeliveryStatus.Statement:
        return 'Проверка';
      case DeliveryStatus.InTransit:
        return 'В пути';
      case DeliveryStatus.Delivered:
        return 'Доставлено';
      case DeliveryStatus.Canceled:
        return 'Отменено';
    }
  }
}
