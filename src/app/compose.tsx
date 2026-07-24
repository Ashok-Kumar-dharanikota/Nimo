import React from 'react';
import { useRouter } from 'expo-router';
import { CaptureSheetModal } from '@/features/home/components/CaptureSheetModal';
import { useHomeData } from '@/features/home/hooks/useHomeData';

export default function ComposeScreen() {
  const router = useRouter();
  const { addQuickMoment, isAddingMoment } = useHomeData();

  const handleSave = async (
    content: string,
    emotion?: string,
    mediaUri?: string,
    mediaType?: 'photo' | 'video',
    title?: string
  ) => {
    try {
      await addQuickMoment({ content, emotion, mediaUri, mediaType, title });
    } catch (e) {
      console.error('Error saving moment:', e);
    }
  };

  return (
    <CaptureSheetModal
      visible={true}
      onClose={() => router.back()}
      onSave={handleSave}
      isSaving={isAddingMoment}
    />
  );
}
