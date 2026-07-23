import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import {
  User,
  Mail,
  Palette,
  Bell,
  BellOff,
  Clock,
  HardDrive,
  Trash2,
  Cpu,
  Info,
  Shield,
  FileText,
  ChevronRight,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useProfileStore, type ProfileData } from '@/features/profile/hooks/useProfileStore';

function SettingsSection({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay)} className="mb-5">
      <Text className="font-jakarta text-[11px] font-bold tracking-wider text-[#a89a8b] uppercase mb-2 px-1">
        {title}
      </Text>
      <View className="bg-white rounded-[20px] border border-[#efe9e1] overflow-hidden">
        {children}
      </View>
    </Animated.View>
  );
}

function SettingsRow({ icon: Icon, label, value, onPress, rightElement }: {
  icon: any;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={() => {
        if (onPress) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }
      }}
      className="flex-row items-center px-4 py-3.5"
    >
      <View className="w-9 h-9 rounded-[12px] bg-[#f0eee9] items-center justify-center mr-3">
        <Icon size={18} color="#4f453f" />
      </View>
      <Text className="font-jakarta text-[14px] font-medium text-[#27170c] flex-1">{label}</Text>
      {rightElement ?? (
        <>
          {value && (
            <Text className="font-jakarta text-[12px] text-[#a89a8b] mr-1" numberOfLines={1}>
              {value}
            </Text>
          )}
          {onPress && <ChevronRight size={16} color="#c4b8aa" />}
        </>
      )}
    </TouchableOpacity>
  );
}

function Divider() {
  return <View className="h-[1px] bg-[#efe9e1] mx-4" />;
}

export default function Settings() {
  const router = useRouter();
  const { profile, updateProfile, clearProfile } = useProfileStore();

  const themeLabels: Record<string, string> = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  };

  const cycleTheme = () => {
    const themes: ProfileData['theme'][] = ['light', 'dark', 'system'];
    const currentIdx = themes.indexOf(profile.theme);
    const next = themes[(currentIdx + 1) % themes.length];
    updateProfile({ theme: next });
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your memories, journals, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            clearProfile();
            Alert.alert('Done', 'All local data has been cleared.');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbf9f4]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          className="w-10 h-10 rounded-full bg-[#f0eee9] items-center justify-center border border-[#e4e2dd] mr-3"
        >
          <ArrowLeft size={18} color="#4f453f" />
        </TouchableOpacity>
        <Text className="font-playfair text-[24px] font-bold text-[#27170c]">Settings</Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Account */}
        <SettingsSection title="Account" delay={0}>
          <SettingsRow
            icon={User}
            label="Name"
            value={profile.name}
            onPress={() => Alert.alert('Edit Name', 'Go to Profile to edit your name.')}
          />
          <Divider />
          <SettingsRow
            icon={Mail}
            label="Email"
            value={profile.email || 'Not set'}
            onPress={() => Alert.alert('Email', 'Email editing coming soon.')}
          />
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection title="Appearance" delay={50}>
          <SettingsRow
            icon={Palette}
            label="Theme"
            value={themeLabels[profile.theme]}
            onPress={cycleTheme}
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications" delay={100}>
          <SettingsRow
            icon={profile.dailyReminderEnabled ? Bell : BellOff}
            label="Daily Reminder"
            rightElement={
              <Switch
                value={profile.dailyReminderEnabled}
                onValueChange={(value) => updateProfile({ dailyReminderEnabled: value })}
                trackColor={{ false: '#d2c4bc', true: '#566434' }}
                thumbColor="#ffffff"
              />
            }
          />
          {profile.dailyReminderEnabled && (
            <>
              <Divider />
              <SettingsRow
                icon={Clock}
                label="Reminder Time"
                value={profile.reminderTime}
                onPress={() => Alert.alert('Reminder Time', `Current: ${profile.reminderTime}. Date picker package needed to change.`)}
              />
            </>
          )}
        </SettingsSection>

        {/* Storage & Data */}
        <SettingsSection title="Storage & Data" delay={150}>
          <SettingsRow
            icon={HardDrive}
            label="Clear Cache"
            onPress={() => Alert.alert('Cache', 'Cache cleared.')}
          />
          <Divider />
          <SettingsRow
            icon={Feather}
            label="Export Journal Data"
            onPress={() => Alert.alert('Export', 'Export functionality coming soon.')}
          />
        </SettingsSection>

        {/* AI Settings */}
        <SettingsSection title="AI Settings" delay={200}>
          <SettingsRow
            icon={Cpu}
            label="On-Device Model"
            value="Manage"
            onPress={() => Alert.alert('AI Model', 'Go to the Nimo AI tab to manage models.')}
          />
        </SettingsSection>

        {/* About */}
        <SettingsSection title="About" delay={250}>
          <SettingsRow icon={Info} label="Version" value="1.0.0" />
          <Divider />
          <SettingsRow
            icon={Shield}
            label="Privacy Policy"
            onPress={() => router.push('/privacy')}
          />
          <Divider />
          <SettingsRow
            icon={FileText}
            label="Terms of Service"
            onPress={() => router.push('/terms')}
          />
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection title="Danger Zone" delay={300}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleDeleteAllData}
            className="flex-row items-center px-4 py-3.5"
          >
            <View className="w-9 h-9 rounded-[12px] bg-[#fde8e8] items-center justify-center mr-3">
              <Trash2 size={18} color="#dc2626" />
            </View>
            <Text className="font-jakarta text-[14px] font-medium text-[#dc2626] flex-1">
              Delete All Data
            </Text>
            <AlertTriangle size={16} color="#dc2626" />
          </TouchableOpacity>
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
