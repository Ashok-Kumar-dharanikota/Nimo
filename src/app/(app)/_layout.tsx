import { useSubscription } from '@/components/SubscriptionProvider';
import * as Haptics from 'expo-haptics';
import { Tabs, useRouter } from 'expo-router';
import { House, Plus, Search, User } from 'lucide-react-native';
import { Image, TouchableOpacity, View } from 'react-native';
import { useEffect } from 'react';
import { useNotificationScheduler } from '@/hooks/useNotificationScheduler';

export default function AppLayout() {
  const router = useRouter();
  const { isPremium } = useSubscription();
  const { scheduleNotifications } = useNotificationScheduler();

  useEffect(() => {
    scheduleNotifications();
  }, [scheduleNotifications]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#566434',
        tabBarInactiveTintColor: '#8c8e8a',
        tabBarStyle: {
          backgroundColor: '#fbf9f4',
          borderTopColor: '#eef1e4',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          fontFamily: 'Plus Jakarta Sans',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />

      {/* Floating Moment Creation Button */}
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarButton: () => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push({ pathname: '/(app)/home', params: { create: 'true' } });
              }}
              style={{
                top: -18,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 12,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: '#566434',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#566434',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.35,
                  shadowRadius: 10,
                  elevation: 8,
                  borderWidth: 3,
                  borderColor: '#fbf9f4',
                }}
              >
                <Plus size={26} color="#ffffff" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="ai"
        options={{
          title: 'Nimo AI',
          tabBarIcon: ({ color, size, focused }) => (
            <Image
              source={require('../../../assets/images/nimo/nimoAI.png')}
              style={{ width: size * 3, height: size * 3, tintColor: focused ? color : '#8c8e8a' }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="journal"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
