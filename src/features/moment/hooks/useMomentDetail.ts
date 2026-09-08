import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { momentService } from '../services/momentService';
import type { MomentDetailData } from '../utils/momentConstants';

export function useMomentDetail(passedId?: string | number) {
  const params = useLocalSearchParams<{ id?: string }>();
  const idStr = passedId !== undefined ? String(passedId) : params.id;

  const [momentData, setMomentData] = useState<MomentDetailData | null>(null);
  const [taskCompleted, setTaskCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!idStr) {
        setIsLoading(false);
        return;
      }

      const momentId = parseInt(idStr, 10);
      if (isNaN(momentId)) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const data = await momentService.getMomentById(momentId);
      if (data) {
        setMomentData(data);
        const taskStatus = await momentService.getTaskStatusForDate(data.createdAt);
        setTaskCompleted(taskStatus);
      }
      setIsLoading(false);
    }

    loadData();
  }, [idStr]);

  return {
    momentData,
    taskCompleted,
    isLoading,
  };
}
