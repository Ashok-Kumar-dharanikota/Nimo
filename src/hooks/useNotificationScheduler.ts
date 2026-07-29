import { useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useProfileStore } from '@/features/profile/hooks/useProfileStore';
import { useSubscription } from '@/components/SubscriptionProvider';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotificationScheduler() {
  const { profile } = useProfileStore();
  const { isPremium } = useSubscription();

  const requestPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  };

  const scheduleNotifications = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    // Cancel all previously scheduled notifications to avoid duplicates when user details change
    await Notifications.cancelAllScheduledNotificationsAsync();

    const firstName = profile.name ? profile.name.trim().split(" ")[0] : "there";

    // 1. Daily Notification
    if (profile.dailyReminderEnabled) {
      const [hourStr, minuteStr] = profile.reminderTime.split(':');
      const hour = parseInt(hourStr, 10) || 20;
      const minute = parseInt(minuteStr, 10) || 0;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Hi ${firstName}! 🌟`,
          body: "Time to set up your daily task and record your moments.",
        },
        trigger: {
          channelId: 'daily',
          hour: hour,
          minute: minute,
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
        },
      });
    }

    // 2. Weekly Premium Reminder (Every Saturday at 11 AM)
    // Only schedule if user is not premium
    if (!isPremium) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Unlock Premium, ${firstName} 💎`,
          body: "Upgrade to premium to enjoy all features of Nimo without limits!",
        },
        trigger: {
          channelId: 'weekly',
          weekday: 7, // Saturday (1=Sunday, 7=Saturday)
          hour: 11,
          minute: 0,
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        },
      });
    }
  }, [profile.name, profile.dailyReminderEnabled, profile.reminderTime, isPremium]);

  const initChannels = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily', {
        name: 'Daily Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
      await Notifications.setNotificationChannelAsync('weekly', {
        name: 'Weekly Offers',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  };

  useEffect(() => {
    initChannels();
  }, []);

  return { requestPermissions, scheduleNotifications };
}
