using System;

namespace Core.Exceptions
{
    public class NotFoundException : Exception
    {
        private const string DEFAULTMESSAGE = "Not found";
        public NotFoundException() : base(DEFAULTMESSAGE)
        {
        }
        public NotFoundException(string message) : base(message)
        {
        }
    }
}
