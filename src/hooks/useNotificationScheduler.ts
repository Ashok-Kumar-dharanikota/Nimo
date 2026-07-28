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

    // 1. Daily Notifications (9 AM, 1 PM, 5 PM, 8 PM)
    const dailyTimes = [
      { hour: 9, minute: 0 },
      { hour: 13, minute: 0 },
      { hour: 17, minute: 0 },
      { hour: 20, minute: 0 },
    ];

    for (const time of dailyTimes) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Hi ${firstName}! 🌟`,
          body: "Time to set up your daily task and record your moments.",
        },
        trigger: {
          channelId: 'daily',
          hour: time.hour,
          minute: time.minute,
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
  }, [profile.name, isPremium]);

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
