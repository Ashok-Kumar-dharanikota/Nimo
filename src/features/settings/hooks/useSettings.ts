import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useProfileStore, type ProfileData } from '@/features/profile/hooks/useProfileStore';
import { settingsService } from '../services/settingsService';

export function useSettings() {
  const router = useRouter();
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const signOut = useProfileStore((state) => state.signOut);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: '',
    message: '',
  });

  const cycleTheme = () => {
    const themes: ProfileData['theme'][] = ['light', 'dark', 'system'];
    const currentIdx = themes.indexOf(profile.theme);
    const next = themes[(currentIdx + 1) % themes.length];
    updateProfile({ theme: next });
  };

  const showInfo = (title: string, message: string) => {
    setInfoModal({ visible: true, title, message });
  };

  const closeInfo = () => {
    setInfoModal({ visible: false, title: '', message: '' });
  };

  const handleSignOut = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await signOut();
    router.replace('/auth');
  };

  const confirmDeleteData = async () => {
    setDeleteModalVisible(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await settingsService.clearAllData();
    showInfo('Done', 'All local data has been cleared.');
  };

  return {
    profile,
    updateProfile,
    cycleTheme,
    deleteModalVisible,
    setDeleteModalVisible,
    infoModal,
    showInfo,
    closeInfo,
    handleSignOut,
    confirmDeleteData,
  };
}
