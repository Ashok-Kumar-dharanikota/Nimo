import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWeeklyStreaks,
  getRecentEntries,
  getTodaysFlow,
  addQuickMoment,
  getMomentsForCurrentYear,
  getGardenSummary,
  deleteMoment,
  type GardenSummary,
} from '../services/homeService';

export const useGardenData = () => {
  const query = useQuery({
    queryKey: ['memoryTree'],
    queryFn: () => getMomentsForCurrentYear(),
  });

  return {
    memoryTree: query.data || [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};

export const useHomeData = (selectedDate?: Date) => {
  const queryClient = useQueryClient();

  const selectedDateIso = selectedDate ? selectedDate.toISOString() : undefined;

  const weeklyStreaksQuery = useQuery({
    queryKey: ['weeklyStreaks'],
    queryFn: getWeeklyStreaks,
  });

  const recentEntriesQuery = useQuery({
    queryKey: ['recentEntries'],
    queryFn: getRecentEntries,
  });

  const todaysFlowQuery = useQuery({
    queryKey: ['todaysFlow', selectedDateIso],
    queryFn: () => getTodaysFlow(selectedDate),
  });

  const gardenSummaryQuery = useQuery({
    queryKey: ['gardenSummary'],
    queryFn: getGardenSummary,
  });

  const addMomentMutation = useMutation({
    mutationFn: async ({
      content,
      emotion,
      title,
      mediaUri,
      mediaType,
      isDraft,
      id,
    }: {
      content: string;
      emotion?: string | null;
      title?: string | null;
      mediaUri?: string | null;
      mediaType?: string | null;
      isDraft?: boolean;
      id?: number | null;
    }) => {
      return addQuickMoment(
        content,
        emotion ?? null,
        title ?? null,
        mediaUri ?? null,
        mediaType ?? null,
        isDraft ?? false,
        id
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyStreaks'] });
      queryClient.invalidateQueries({ queryKey: ['recentEntries'] });
      queryClient.invalidateQueries({ queryKey: ['todaysFlow'] });
      queryClient.invalidateQueries({ queryKey: ['gardenSummary'] });
      queryClient.invalidateQueries({ queryKey: ['memoryTree'] });
    },
  });

  const deleteMomentMutation = useMutation({
    mutationFn: (id: number) => deleteMoment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyStreaks'] });
      queryClient.invalidateQueries({ queryKey: ['recentEntries'] });
      queryClient.invalidateQueries({ queryKey: ['todaysFlow'] });
      queryClient.invalidateQueries({ queryKey: ['gardenSummary'] });
      queryClient.invalidateQueries({ queryKey: ['memoryTree'] });
    },
  });

  const refetch = useCallback(() => {
    weeklyStreaksQuery.refetch();
    recentEntriesQuery.refetch();
    todaysFlowQuery.refetch();
    gardenSummaryQuery.refetch();
  }, [weeklyStreaksQuery, recentEntriesQuery, todaysFlowQuery, gardenSummaryQuery]);

  return {
    weeklyStreaks: weeklyStreaksQuery.data || [],
    recentEntries: recentEntriesQuery.data || [],
    todaysFlow: todaysFlowQuery.data || [],
    gardenSummary: gardenSummaryQuery.data || { leavesCount: 0, lastRecordDate: null, daysActive: 0 },
    memoryTree: [],
    isLoading: todaysFlowQuery.isLoading || gardenSummaryQuery.isLoading,
    addQuickMoment: addMomentMutation.mutateAsync,
    deleteMoment: deleteMomentMutation.mutateAsync,
    isAddingMoment: addMomentMutation.isPending,
    refetch,
  };
};
