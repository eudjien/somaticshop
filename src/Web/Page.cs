using System;
using System.Collections.Generic;

namespace Web
{
    public class Page<T>
    {
        public IEnumerable<T> Items { get; set; }

        public int PageNumber { get; private set; }
        public int TotalPages { get; private set; }
        public int TotalItems { get; private set; }

        public Page()
        {
            Items = new List<T>();
        }

        public Page(IEnumerable<T> items, int totalItems, int pageNumber, int pageSize)
        {
            PageNumber = pageNumber;
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
            Items = items;
            TotalItems = totalItems;
        }

        public bool HasPreviousPage => PageNumber > 1;
        public bool HasNextPage => PageNumber < TotalPages;
    }
}
