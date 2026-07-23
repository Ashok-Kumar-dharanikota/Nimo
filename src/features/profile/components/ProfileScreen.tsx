import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Flame,
  Settings,
  Shield,
  FileText,
  ChevronRight,
  Edit3,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useProfileStore } from '../hooks/useProfileStore';
import { useHomeData } from '@/features/home/hooks/useHomeData';
import { calculateStreak } from '@/features/home/utils/dateUtils';

export function ProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProfileStore();
  const { weeklyStreaks, memoryTree } = useHomeData();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(profile.name);

  const streak = calculateStreak(weeklyStreaks);
  const totalMemories = memoryTree.reduce((acc, day) => acc + (day.moments?.length || 0), 0);
  const daysActive = memoryTree.filter((d) => d.moments.length > 0).length;

  const handleSaveName = () => {
    const trimmed = editName.trim();
    if (trimmed) {
      updateProfile({ name: trimmed });
    }
    setIsEditingName(false);
  };

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <Animated.View entering={FadeInDown.duration(400)} className="items-center pt-6 pb-5 px-6">
        {/* Avatar */}
        <View className="w-24 h-24 rounded-full bg-[#566434] items-center justify-center mb-4 shadow-lg"
          style={{
            shadowColor: '#566434',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
          }}
        >
          <Text className="font-playfair text-[32px] font-bold text-white">{initials}</Text>
        </View>

        {/* Name */}
        {isEditingName ? (
          <View className="flex-row items-center gap-2 mb-1">
            <TextInput
              className="font-playfair text-[24px] font-bold text-[#27170c] text-center border-b border-[#566434] pb-1 min-w-[120px]"
              value={editName}
              onChangeText={setEditName}
              onBlur={handleSaveName}
              onSubmitEditing={handleSaveName}
              autoFocus
              returnKeyType="done"
            />
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setEditName(profile.name);
              setIsEditingName(true);
            }}
            className="flex-row items-center gap-1.5 mb-1"
          >
            <Text className="font-playfair text-[24px] font-bold text-[#27170c]">
              {profile.name}
            </Text>
            <Edit3 size={14} color="#a89a8b" />
          </TouchableOpacity>
        )}

        {profile.email ? (
          <Text className="font-jakarta text-[13px] text-[#8c7c6c]">{profile.email}</Text>
        ) : (
          <TouchableOpacity
            onPress={() => {
              Alert.prompt?.(
                'Add Email',
                'Enter your email address',
                (text: string) => updateProfile({ email: text }),
              ) ?? Alert.alert('Email', 'Email editing coming soon');
            }}
          >
            <Text className="font-jakarta text-[13px] text-[#566434] underline">Add email</Text>
          </TouchableOpacity>
        )}

        <Text className="font-jakarta text-[11px] text-[#a89a8b] mt-1">
          Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
      </Animated.View>

      {/* Stats Cards */}
      <Animated.View entering={FadeInDown.delay(100)} className="flex-row px-5 gap-3 mb-5">
        <View className="flex-1 bg-[#eef1e4] rounded-[20px] p-4 items-center border border-[#dde5cc]">
          <BookOpen size={20} color="#566434" />
          <Text className="font-playfair text-[24px] font-bold text-[#27170c] mt-1">{totalMemories}</Text>
          <Text className="font-jakarta text-[10px] font-semibold text-[#566434] uppercase tracking-wider">Memories</Text>
        </View>

        <View className="flex-1 bg-[#f7ede2] rounded-[20px] p-4 items-center border border-[#f0e0cc]">
          <Flame size={20} color="#b5651d" />
          <Text className="font-playfair text-[24px] font-bold text-[#27170c] mt-1">{streak}</Text>
          <Text className="font-jakarta text-[10px] font-semibold text-[#b5651d] uppercase tracking-wider">Day Streak</Text>
        </View>

        <View className="flex-1 bg-[#f2e7ea] rounded-[20px] p-4 items-center border border-[#e8d5db]">
          <Calendar size={20} color="#a3506a" />
          <Text className="font-playfair text-[24px] font-bold text-[#27170c] mt-1">{daysActive}</Text>
          <Text className="font-jakarta text-[10px] font-semibold text-[#a3506a] uppercase tracking-wider">Days Active</Text>
        </View>
      </Animated.View>

      {/* Menu Sections */}
      <Animated.View entering={FadeInDown.delay(200)} className="px-5">
        {/* Account Section */}
        <Text className="font-jakarta text-[11px] font-bold tracking-wider text-[#a89a8b] uppercase mb-2 px-1">
          Account
        </Text>
        <View className="bg-white rounded-[20px] border border-[#efe9e1] overflow-hidden mb-5">
          <MenuItem icon={User} label="Edit Name" value={profile.name} onPress={() => {
            setEditName(profile.name);
            setIsEditingName(true);
          }} />
          <View className="h-[1px] bg-[#efe9e1] mx-4" />
          <MenuItem icon={Mail} label="Email" value={profile.email || 'Not set'} onPress={() => {
            Alert.alert('Email', 'Email editing coming soon');
          }} />
        </View>

        {/* Quick Links */}
        <Text className="font-jakarta text-[11px] font-bold tracking-wider text-[#a89a8b] uppercase mb-2 px-1">
          More
        </Text>
        <View className="bg-white rounded-[20px] border border-[#efe9e1] overflow-hidden mb-5">
          <MenuItem icon={Settings} label="Settings" onPress={() => router.push('/settings')} />
          <View className="h-[1px] bg-[#efe9e1] mx-4" />
          <MenuItem icon={Shield} label="Privacy Policy" onPress={() => router.push('/privacy')} />
          <View className="h-[1px] bg-[#efe9e1] mx-4" />
          <MenuItem icon={FileText} label="Terms of Service" onPress={() => router.push('/terms')} />
        </View>
      </Animated.View>
    </ScrollView>
  );
}

function MenuItem({ icon: Icon, label, value, onPress }: {
  icon: any;
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      className="flex-row items-center px-4 py-3.5"
    >
      <View className="w-9 h-9 rounded-[12px] bg-[#f0eee9] items-center justify-center mr-3">
        <Icon size={18} color="#4f453f" />
      </View>
      <Text className="font-jakarta text-[14px] font-medium text-[#27170c] flex-1">{label}</Text>
      {value && (
        <Text className="font-jakarta text-[12px] text-[#a89a8b] mr-1" numberOfLines={1}>
          {value}
        </Text>
      )}
      <ChevronRight size={16} color="#c4b8aa" />
    </TouchableOpacity>
  );
}
