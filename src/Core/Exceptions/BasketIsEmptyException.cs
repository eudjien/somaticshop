using System;

namespace Core.Exceptions
{
    public class BasketIsEmptyException : Exception
    {
        private const string DEFAULTMESSAGE = "Basket is empty.";
        public BasketIsEmptyException() : base(DEFAULTMESSAGE)
        {
        }
        public BasketIsEmptyException(string message) : base(message)
        {
        }
    }
}
