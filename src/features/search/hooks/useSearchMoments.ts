import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services/searchService';
import type { SearchMomentItem } from '../utils/searchConstants';

export function useSearchMoments() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: moments = [], isLoading, refetch } = useQuery({
    queryKey: ['allMomentsSearch'],
    queryFn: () => searchService.fetchAllMoments(),
  });

  const filteredMoments = useMemo(() => {
    if (!searchQuery.trim()) return moments;
    const q = searchQuery.toLowerCase().trim();
    return moments.filter(
      (m: SearchMomentItem) =>
        m.content.toLowerCase().includes(q) ||
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.journalTitle && m.journalTitle.toLowerCase().includes(q)) ||
        (m.emotion && m.emotion.toLowerCase().includes(q))
    );
  }, [moments, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    moments,
    filteredMoments,
    isLoading,
    refetch,
  };
}
