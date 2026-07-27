import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWeeklyStreaks,
  getRecentEntries,
  getTodaysFlow,
  addQuickMoment,
  getMomentsForCurrentYear,
  deleteMoment,
  getTodayMomentsCount,
} from '../services/homeService';
import { useSubscription } from '@/components/SubscriptionProvider';

export const useHomeData = (selectedDate?: Date) => {
  const queryClient = useQueryClient();
  const { isPremium } = useSubscription();

  const weeklyStreaksQuery = useQuery({
    queryKey: ['weeklyStreaks'],
    queryFn: getWeeklyStreaks,
  });

  const recentEntriesQuery = useQuery({
    queryKey: ['recentEntries'],
    queryFn: getRecentEntries,
  });

  const todaysFlowQuery = useQuery({
    queryKey: ['todaysFlow', selectedDate?.toISOString()],
    queryFn: () => getTodaysFlow(selectedDate),
  });

  const memoryTreeQuery = useQuery({
    queryKey: ['memoryTree'],
    queryFn: () => getMomentsForCurrentYear(),
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
      // Check limits before saving a new moment
      // if (!id && !isDraft) {
      //   const count = await getTodayMomentsCount();
      //   if (count >= 5 && !isPremium) {
      //     throw new Error('LIMIT_REACHED');
      //   }
      // }
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
      queryClient.invalidateQueries({ queryKey: ['memoryTree'] });
    },
  });

  const deleteMomentMutation = useMutation({
    mutationFn: (id: number) => deleteMoment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyStreaks'] });
      queryClient.invalidateQueries({ queryKey: ['recentEntries'] });
      queryClient.invalidateQueries({ queryKey: ['todaysFlow'] });
      queryClient.invalidateQueries({ queryKey: ['memoryTree'] });
    },
  });

  return {
    weeklyStreaks: weeklyStreaksQuery.data || [],
    recentEntries: recentEntriesQuery.data || [],
    todaysFlow: todaysFlowQuery.data || [],
    memoryTree: memoryTreeQuery.data || [],
    isLoading: memoryTreeQuery.isLoading,
    addQuickMoment: addMomentMutation.mutateAsync,
    deleteMoment: deleteMomentMutation.mutateAsync,
    isAddingMoment: addMomentMutation.isPending,
    refetch: () => {
      weeklyStreaksQuery.refetch();
      recentEntriesQuery.refetch();
      todaysFlowQuery.refetch();
      memoryTreeQuery.refetch();
    },
  };
};
