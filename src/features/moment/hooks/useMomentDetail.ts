import { useState, useCallback } from 'react';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { momentService } from '../services/momentService';
import type { MomentDetailData } from '../utils/momentConstants';

export function useMomentDetail(passedId?: string | number) {
  const params = useLocalSearchParams<{ id?: string }>();
  const idStr = passedId !== undefined ? String(passedId) : params.id;

  const [momentData, setMomentData] = useState<MomentDetailData | null>(null);
  const [taskCompleted, setTaskCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!idStr) {
      setIsLoading(false);
      return;
    }

    const momentId = parseInt(idStr, 10);
    if (isNaN(momentId)) {
      setIsLoading(false);
      return;
    }

    const data = await momentService.getMomentById(momentId);
    if (data) {
      setMomentData(data);
      const taskStatus = await momentService.getTaskStatusForDate(data.createdAt);
      setTaskCompleted(taskStatus);
    }
    setIsLoading(false);
  }, [idStr]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  return {
    momentData,
    taskCompleted,
    isLoading,
  };
}
