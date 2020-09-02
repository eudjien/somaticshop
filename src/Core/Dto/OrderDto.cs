using Core.Entities;

namespace Core.Dto
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string Date { get; set; }
        public string Comment { get; set; }
        public DeliveryStatus Status { get; set; }
        public int BuyerId { get; set; }
        public int AddressId { get; set; }

    }
}
