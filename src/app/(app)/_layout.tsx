import { Tabs } from 'expo-router';
import { House, Search, Sparkles, User } from 'lucide-react-native';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#566434',
        tabBarInactiveTintColor: '#8c8e8a',
        tabBarStyle: {
          backgroundColor: '#fbf9f4',
          borderTopColor: '#eef1e4',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
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

      <Tabs.Screen
        name="ai"
        options={{
          title: 'Nimo AI',
          tabBarIcon: ({ color, size }) => <Sparkles size={size} color={color} />,
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
        name="add"
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
