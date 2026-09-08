import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  User,
  Mail,
  Palette,
  Bell,
  BellOff,
  Clock,
  Trash2,
  Info,
  Shield,
  FileText,
  ArrowLeft,
  AlertTriangle,
  Lightbulb,
  LogOut,
  LogIn,
} from 'lucide-react-native';
import { CustomModal } from '@/components/ui/CustomModal';
import Constants from 'expo-constants';

import { useSettings } from '../hooks/useSettings';
import { SettingsSection } from './SettingsSection';
import { SettingsRow, SettingsDivider } from './SettingsRow';
import { THEME_LABELS, FEATURE_REQUEST_MAILTO } from '../utils/settingsConstants';

export function SettingsScreenView() {
  const router = useRouter();
  const {
    profile,
    updateProfile,
    cycleTheme,
    deleteModalVisible,
    setDeleteModalVisible,
    infoModal,
    showInfo,
    closeInfo,
    handleSignOut,
    confirmDeleteData,
  } = useSettings();

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
          />
          <SettingsDivider />
          <SettingsRow
            icon={Mail}
            label="Email"
            value={profile.email || 'Not set'}
          />
          <SettingsDivider />
          {profile.isGuest || !profile.email ? (
            <SettingsRow
              icon={LogIn}
              label="Link Google Account"
              onPress={() => router.push('/auth')}
            />
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSignOut}
              className="flex-row items-center px-4 py-3.5"
            >
              <View className="w-9 h-9 rounded-[12px] bg-[#f0eee9] items-center justify-center mr-3">
                <LogOut size={18} color="#4f453f" />
              </View>
              <Text className="font-jakarta text-[14px] font-medium text-[#27170c] flex-1">
                Sign Out
              </Text>
            </TouchableOpacity>
          )}
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection title="Appearance" delay={50}>
          <SettingsRow
            icon={Palette}
            label="Theme"
            value={THEME_LABELS[profile.theme]}
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
              <SettingsDivider />
              <SettingsRow
                icon={Clock}
                label="Reminder Time"
                value={profile.reminderTime}
                onPress={() => showInfo('Reminder Time', `Current reminder time is set to ${profile.reminderTime}.`)}
              />
            </>
          )}
        </SettingsSection>

        {/* About */}
        <SettingsSection title="About" delay={250}>
          <SettingsRow
            icon={Info}
            label="Version"
            value={Constants.expoConfig?.version || '1.0.0'}
          />
          <SettingsDivider />
          <SettingsRow
            icon={Shield}
            label="Privacy Policy"
            onPress={() => router.push('/privacy')}
          />
          <SettingsDivider />
          <SettingsRow
            icon={FileText}
            label="Terms of Service"
            onPress={() => router.push('/terms')}
          />
          <SettingsDivider />
          <SettingsRow
            icon={Lightbulb}
            label="Request a Feature"
            onPress={() => Linking.openURL(FEATURE_REQUEST_MAILTO)}
          />
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection title="Danger Zone" delay={300}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setDeleteModalVisible(true)}
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

      {/* Delete All Data Confirmation Modal */}
      <CustomModal
        visible={deleteModalVisible}
        title="Delete All Data"
        message="This will permanently delete all your memories, journals, and settings. This action cannot be undone."
        confirmText="Delete Everything"
        cancelText="Cancel"
        destructive
        onConfirm={confirmDeleteData}
        onCancel={() => setDeleteModalVisible(false)}
      />

      {/* General Info Modal */}
      <CustomModal
        visible={infoModal.visible}
        title={infoModal.title}
        message={infoModal.message}
        confirmText="OK"
        onConfirm={closeInfo}
      />
    </SafeAreaView>
  );
}
