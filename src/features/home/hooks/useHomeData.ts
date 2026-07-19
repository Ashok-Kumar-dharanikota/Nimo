import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWeeklyStreaks, getRecentEntries, getTodaysFlow, addQuickMoment } from '../services/homeService';

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

  const addMomentMutation = useMutation({
    mutationFn: (content: string) => addQuickMoment(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyStreaks'] });
      queryClient.invalidateQueries({ queryKey: ['recentEntries'] });
      queryClient.invalidateQueries({ queryKey: ['todaysFlow'] });
    }
  });

  return {
    weeklyStreaks: weeklyStreaksQuery.data || [],
    recentEntries: recentEntriesQuery.data || [],
    todaysFlow: todaysFlowQuery.data || [],
    isLoading: weeklyStreaksQuery.isLoading || recentEntriesQuery.isLoading || todaysFlowQuery.isLoading,
    addQuickMoment: addMomentMutation.mutate,
    isAddingMoment: addMomentMutation.isPending,
    refetch: () => {
      weeklyStreaksQuery.refetch();
      recentEntriesQuery.refetch();
      todaysFlowQuery.refetch();
    }
  };
};
