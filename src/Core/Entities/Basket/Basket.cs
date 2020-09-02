using System.Collections.Generic;

namespace Core.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string UserOrAnonymousId { get; set; }
        public ICollection<BasketProduct> BasketProducts { get; set; }
        public Basket() { }
        public Basket(string userOrAnonymousId)
        {
            UserOrAnonymousId = userOrAnonymousId;
        }
    }
}
