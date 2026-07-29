import React from 'react';
import { TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { CloudOff, CheckCircle, Cloud } from 'lucide-react-native';
import { useSyncStore } from '@/store/syncStore';
import { syncDatabase } from '@/lib/syncEngine';
import * as Haptics from 'expo-haptics';

export function SyncIndicator() {
  const { status, lastSyncedAt } = useSyncStore();

  const handleSyncPress = () => {
    if (status === 'syncing') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    syncDatabase();
  };

  if (status === 'syncing') {
    return (
      <TouchableOpacity 
        activeOpacity={1}
        className="h-10 w-10 items-center justify-center rounded-full border border-outlineVariant bg-surfaceContainerLowest shadow-sm"
      >
        <ActivityIndicator size="small" color="#566434" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handleSyncPress}
      className={`h-10 w-10 items-center justify-center rounded-full border border-outlineVariant shadow-sm ${status === 'error' ? 'bg-red-50' : 'bg-surfaceContainerLowest'}`}
    >
      {status === 'error' ? (
        <CloudOff size={18} color="#dc2626" />
      ) : status === 'success' ? (
        <CheckCircle size={18} color="#16a34a" />
      ) : (
        <Cloud size={18} color="#4f453f" />
      )}
    </TouchableOpacity>
  );
}
