import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWeeklyStreaks,
  getRecentEntries,
  getTodaysFlow,
  addQuickMoment,
  getMomentsForCurrentYear,
} from '../services/homeService';

export const useHomeData = () => {
  const queryClient = useQueryClient();

  const weeklyStreaksQuery = useQuery({
    queryKey: ['weeklyStreaks'],
    queryFn: getWeeklyStreaks,
  });

  const recentEntriesQuery = useQuery({
    queryKey: ['recentEntries'],
    queryFn: getRecentEntries,
  });

  const todaysFlowQuery = useQuery({
    queryKey: ['todaysFlow'],
    queryFn: getTodaysFlow,
  });

  const memoryTreeQuery = useQuery({
    queryKey: ['memoryTree'],
    queryFn: () => getMomentsForCurrentYear(),
  });

  const addMomentMutation = useMutation({
    mutationFn: ({ content, emotion }: { content: string, emotion?: string }) => addQuickMoment(content, emotion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyStreaks'] });
      queryClient.invalidateQueries({ queryKey: ['recentEntries'] });
      queryClient.invalidateQueries({ queryKey: ['todaysFlow'] });
      queryClient.invalidateQueries({ queryKey: ['memoryTree'] });
    }
  });

  return {
    weeklyStreaks: weeklyStreaksQuery.data || [],
    recentEntries: recentEntriesQuery.data || [],
    todaysFlow: todaysFlowQuery.data || [],
    memoryTree: memoryTreeQuery.data || [],
    isLoading: memoryTreeQuery.isLoading, // only gate on tree query
    addQuickMoment: addMomentMutation.mutate,
    isAddingMoment: addMomentMutation.isPending,
    refetch: () => {
      weeklyStreaksQuery.refetch();
      recentEntriesQuery.refetch();
      todaysFlowQuery.refetch();
      memoryTreeQuery.refetch();
    }
  };
};
