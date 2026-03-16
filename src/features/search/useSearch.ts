import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchAll } from './searchService';
import type { SearchResult } from './searchService';

export type { SearchResult };

export function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results = [], isLoading, isFetching } = useQuery<SearchResult[]>({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchAll(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 1000 * 30,
  });

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching: isLoading || isFetching,
    clearSearch,
    hasQuery: debouncedQuery.trim().length >= 2,
  };
}
