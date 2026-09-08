import { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useHomeData } from '@/features/home/hooks/useHomeData';
import { getTheme } from '@/features/home/utils/gardenUtils';

export function useTimelineData(passedDate?: string) {
  const params = useLocalSearchParams<{ date?: string }>();
  const dateStr = passedDate ?? params.date;

  const targetDate = useMemo(() => {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split('-');
    return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
  }, [dateStr]);

  const { todaysFlow, isLoading } = useHomeData(targetDate);
  const theme = getTheme('sprout');

  const displayDate = targetDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    targetDate,
    todaysFlow,
    isLoading,
    theme,
    displayDate,
  };
}
