using System;
using System.Collections.Generic;

namespace Core.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public DateTimeOffset? Date { get; set; }
        public string Comment { get; set; }
        public DeliveryStatus Status { get; set; }
        public int BuyerId { get; set; }
        public int AddressId { get; set; }
        public Address Address { get; set; }
        public Buyer Buyer { get; set; }
        public ICollection<OrderProduct> OrderProducts { get; set; }
        public Order() { }
        public Order(DateTimeOffset? date, string comment, DeliveryStatus status, int buyerId, int addressId)
        {
            Date = date;
            Comment = comment;
            Status = status;
            BuyerId = buyerId;
            AddressId = addressId;
        }
    }

    public enum DeliveryStatus
    {
        Statement,
        InTransit,
        Delivered,
        Canceled
    }
}
