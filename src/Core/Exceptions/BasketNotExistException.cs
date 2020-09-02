using System;

namespace Core.Exceptions
{
    public class BasketNotExistException : Exception
    {
        private const string DEFAULTMESSAGE = "Basket not exist.";
        public BasketNotExistException() : base(DEFAULTMESSAGE)
        {
        }
        public BasketNotExistException(string message) : base(message)
        {
        }
    }
}
