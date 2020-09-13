using System;
using System.Collections.Generic;

namespace Web
{
    public class Page<T>
    {
        public IEnumerable<T> Items { get; set; }

        public int PageIndex { get; private set; }
        public int TotalPages { get; private set; }
        public int TotalItems { get; private set; }

        public Page()
        {
            Items = new List<T>();
        }

        public Page(IEnumerable<T> items, int totalItems, int pageIndex, int pageSize)
        {
            PageIndex = pageIndex;
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
            Items = items;
            TotalItems = totalItems;
        }

        public bool HasPreviousPage => PageIndex > 0;
        public bool HasNextPage => (PageIndex + 1) < TotalPages;
    }
}
