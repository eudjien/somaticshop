using System;

namespace Core.Exceptions
{
    public class UnsupportedImageException : Exception
    {
        private const string DEFAULTMESSAGE = "Unsupported image";
        public UnsupportedImageException() : base(DEFAULTMESSAGE)
        {
        }
        public UnsupportedImageException(string message) : base(message)
        {
        }
    }
}
