import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodayTask, setTodayTask, completeTask } from '../services/taskService';

export const useTaskData = () => {
  const queryClient = useQueryClient();

  const todayTaskQuery = useQuery({
    queryKey: ['todayTask'],
    queryFn: getTodayTask,
  });

  const setTaskMutation = useMutation({
    mutationFn: (title: string) => setTodayTask(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayTask'] });
    },
  });

  const completeTaskMutation = useMutation({
    mutationFn: ({ id, title }: { id: number; title: string }) => completeTask(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayTask'] });
      // We also need to invalidate home data because we added a moment!
      queryClient.invalidateQueries({ queryKey: ['todaysFlow'] });
      queryClient.invalidateQueries({ queryKey: ['memoryTree'] });
      queryClient.invalidateQueries({ queryKey: ['weeklyStreaks'] });
    },
  });

  return {
    todayTask: todayTaskQuery.data,
    isLoading: todayTaskQuery.isLoading,
    setTodayTask: setTaskMutation.mutateAsync,
    completeTask: completeTaskMutation.mutateAsync,
  };
};
