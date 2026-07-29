import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { List, Circle, Plus, Cpu, User } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface StorybookBottomNavProps {
  activeTab: 'timeline' | 'garden' | 'nimo-ai' | 'profile';
  onTabSelect: (tab: 'timeline' | 'garden' | 'nimo-ai' | 'profile') => void;
  onOpenCapture: () => void;
}

export function StorybookBottomNav({
  activeTab,
  onTabSelect,
  onOpenCapture,
}: StorybookBottomNavProps) {
  return (
    <View
      className="flex-row items-center justify-around h-[66px] bg-[#fbf9f4]/90 rounded-[32px] border border-[#d2c4bc]/50 px-2 shadow-lg"
      style={{
        shadowColor: '#281e14',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 8,
      }}
    >
      {/* 1. Timeline */}
      <TouchableOpacity
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Timeline"
        accessibilityState={{ selected: activeTab === 'timeline' }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onTabSelect('timeline');
        }}
        className="items-center justify-center gap-0.5 px-3 py-1"
      >
        <List
          size={20}
          color={activeTab === 'timeline' ? '#566434' : '#a89a8b'}
        />
        <Text
          className={`font-jakarta text-[9.5px] ${
            activeTab === 'timeline' ? 'font-bold text-[#566434]' : 'font-semibold text-[#a89a8b]'
          }`}
        >
          Timeline
        </Text>
      </TouchableOpacity>

      {/* 2. Garden */}
      <TouchableOpacity
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Garden"
        accessibilityState={{ selected: activeTab === 'garden' }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onTabSelect('garden');
        }}
        className="items-center justify-center gap-0.5 px-3 py-1"
      >
        <Circle
          size={20}
          color={activeTab === 'garden' ? '#566434' : '#a89a8b'}
        />
        <Text
          className={`font-jakarta text-[9.5px] ${
            activeTab === 'garden' ? 'font-bold text-[#566434]' : 'font-semibold text-[#a89a8b]'
          }`}
        >
          Garden
        </Text>
      </TouchableOpacity>

      {/* 3. Center Elevated + Capture Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Add Moment"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onOpenCapture();
        }}
        className="-mt-7 w-[60px] h-[60px] rounded-[30px] bg-[#566434] items-center justify-center shadow-xl border border-white/20"
        style={{
          shadowColor: '#566434',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.5,
          shadowRadius: 12,
          elevation: 10,
        }}
      >
        <Plus size={26} color="#ffffff" />
      </TouchableOpacity>

      {/* 4. Nimo AI */}
      <TouchableOpacity
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Nimo AI"
        accessibilityState={{ selected: activeTab === 'nimo-ai' }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onTabSelect('nimo-ai');
        }}
        className="items-center justify-center gap-0.5 px-3 py-1"
      >
        <Cpu
          size={20}
          color={activeTab === 'nimo-ai' ? '#566434' : '#a89a8b'}
        />
        <Text
          className={`font-jakarta text-[9.5px] ${
            activeTab === 'nimo-ai' ? 'font-bold text-[#566434]' : 'font-semibold text-[#a89a8b]'
          }`}
        >
          Nimo AI
        </Text>
      </TouchableOpacity>

      {/* 5. Profile */}
      <TouchableOpacity
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Profile"
        accessibilityState={{ selected: activeTab === 'profile' }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onTabSelect('profile');
        }}
        className="items-center justify-center gap-0.5 px-3 py-1"
      >
        <User
          size={20}
          color={activeTab === 'profile' ? '#566434' : '#a89a8b'}
        />
        <Text
          className={`font-jakarta text-[9.5px] ${
            activeTab === 'profile' ? 'font-bold text-[#566434]' : 'font-semibold text-[#a89a8b]'
          }`}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}
