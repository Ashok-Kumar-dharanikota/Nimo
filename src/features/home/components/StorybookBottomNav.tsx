import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface StorybookBottomNavProps {
  activeTab: 'timeline' | 'garden' | 'search' | 'profile';
  onTabSelect: (tab: 'timeline' | 'garden' | 'search' | 'profile') => void;
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
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onTabSelect('timeline');
        }}
        className="items-center justify-center gap-0.5 px-3 py-1"
      >
        <Feather
          name="list"
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
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onTabSelect('garden');
        }}
        className="items-center justify-center gap-0.5 px-3 py-1"
      >
        <Feather
          name="circle"
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
        <Feather name="plus" size={26} color="#ffffff" />
      </TouchableOpacity>

      {/* 4. Search */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onTabSelect('search');
        }}
        className="items-center justify-center gap-0.5 px-3 py-1"
      >
        <Feather
          name="search"
          size={20}
          color={activeTab === 'search' ? '#566434' : '#a89a8b'}
        />
        <Text
          className={`font-jakarta text-[9.5px] ${
            activeTab === 'search' ? 'font-bold text-[#566434]' : 'font-semibold text-[#a89a8b]'
          }`}
        >
          Search
        </Text>
      </TouchableOpacity>

      {/* 5. Profile */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onTabSelect('profile');
        }}
        className="items-center justify-center gap-0.5 px-3 py-1"
      >
        <Feather
          name="user"
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
