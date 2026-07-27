import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodayTasks, setTodayTask, completeTask } from '../services/taskService';

export const useTaskData = (selectedDate?: Date) => {
  const queryClient = useQueryClient();

  const todayTasksQuery = useQuery({
    queryKey: ['todayTasks', selectedDate?.toISOString()],
    queryFn: () => getTodayTasks(selectedDate),
  });

  const setTaskMutation = useMutation({
    mutationFn: (title: string) => setTodayTask(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayTasks'] });
    },
  });

  const completeTaskMutation = useMutation({
    mutationFn: ({ id, title }: { id: number; title: string }) => completeTask(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayTasks'] });
      // We also need to invalidate home data because we added a moment!
      queryClient.invalidateQueries({ queryKey: ['todaysFlow'] });
      queryClient.invalidateQueries({ queryKey: ['memoryTree'] });
      queryClient.invalidateQueries({ queryKey: ['weeklyStreaks'] });
    },
  });

  return {
    todayTasks: todayTasksQuery.data || [],
    isLoading: todayTasksQuery.isLoading,
    setTodayTask: setTaskMutation.mutateAsync,
    completeTask: completeTaskMutation.mutateAsync,
  };
};
