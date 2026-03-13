import { useMemo, useState } from 'react';

type UseAdminFiltersOptions<T extends object> = {
  initialSearch?: string;
  initialStatus?: string;
  statusAccessor?: (item: T) => string | undefined;
  searchAccessor?: (item: T) => string;
};

export function useAdminFilters<T extends object>(items: T[], options?: UseAdminFiltersOptions<T>) {
  const [search, setSearch] = useState(options?.initialSearch ?? '');
  const [status, setStatus] = useState(options?.initialStatus ?? 'all');

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (status !== 'all' && options?.statusAccessor) {
        const itemStatus = options.statusAccessor(item);
        if (itemStatus !== status) return false;
      }

      if (!search.trim()) return true;

      const haystack = options?.searchAccessor ? options.searchAccessor(item) : JSON.stringify(item);
      return haystack.toLowerCase().includes(search.toLowerCase());
    });
  }, [items, options, search, status]);

  return {
    search,
    setSearch,
    status,
    setStatus,
    filtered,
  };
}
