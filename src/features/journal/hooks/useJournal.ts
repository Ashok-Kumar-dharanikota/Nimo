import { useQuery } from '@tanstack/react-query';
import { journalService } from '../services/journalService';

export function useJournal() {
  const { data: journals = [], isLoading, refetch } = useQuery({
    queryKey: ['allJournals'],
    queryFn: () => journalService.listJournals(),
  });

  return {
    journals,
    isLoading,
    refetch,
  };
}
