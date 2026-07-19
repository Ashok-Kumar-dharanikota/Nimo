import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
// Padding 20 on each side (40), gap of 16, and add button of 65
const TAB_BAR_WIDTH = width - 40 - 16 - 65; 
const TAB_ITEM_WIDTH = TAB_BAR_WIDTH / 4;

const TABS = [
  { name: 'home', icon: 'home', route: '/home' },
  { name: 'journal', icon: 'edit-document', route: '/journal' },
  { name: 'calendar', icon: 'calendar-today', route: '/calendar' },
  { name: 'settings', icon: 'settings', route: '/settings' },
];

export default function FloatingTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const getActiveIndex = () => {
    if (pathname === '/') return 0;
    const index = TABS.findIndex(t => t.route === pathname);
    return index >= 0 ? index : 0;
  };

  const [activeIndex, setActiveIndex] = useState(getActiveIndex());
  const translateX = useSharedValue(getActiveIndex() * TAB_ITEM_WIDTH);

  useEffect(() => {
    const newIndex = getActiveIndex();
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      translateX.value = withSpring(newIndex * TAB_ITEM_WIDTH, {
        damping: 20,
        stiffness: 250,
      });
    }
  }, [pathname]);

  const handlePress = (index: number, route: string) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
      translateX.value = withSpring(index * TAB_ITEM_WIDTH, {
        damping: 20,
        stiffness: 250,
      });
      // Navigate to trigger Stack transition
      router.navigate(route as any);
    }
  };

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View className="absolute bottom-6 left-5 right-5 flex-row gap-4 z-50">
      {/* Floating Tab Bar */}
      <View 
        className="flex-1 h-[65px] bg-surfaceContainerLowest rounded-[35px] shadow-[0_10px_20px_rgba(0,0,0,0.05)] flex-row items-center border border-surfaceVariant/20 relative overflow-hidden"
      >
        {/* Sliding Indicator */}
        <Animated.View 
          className="absolute h-12 rounded-[24px] bg-sage/20 top-[8px] left-0"
          style={[
            { width: TAB_ITEM_WIDTH },
            indicatorStyle
          ]}
        />

        {TABS.map((tab, index) => {
          const isActive = activeIndex === index;
          return (
            <TouchableOpacity
              key={tab.name}
              activeOpacity={0.8}
              onPress={() => handlePress(index, tab.route)}
              className="flex-1 items-center justify-center h-full z-10"
            >
              <MaterialIcons 
                name={tab.icon as any} 
                size={24} 
                color={isActive ? '#566434' : '#8c8c8c'} 
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Add Button to the right */}
      <TouchableOpacity 
        className="w-[65px] h-[65px] bg-sage rounded-full items-center justify-center shadow-lg border-4 border-background"
        activeOpacity={0.8}
        onPress={() => console.log('Add Moment Triggered')}
      >
        <MaterialIcons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
