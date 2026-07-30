import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function TermsOfServiceNative() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-surfaceVariant">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full bg-surfaceContainerLow active:opacity-75"
        >
          <Text className="text-primary font-bold text-lg">←</Text>
        </TouchableOpacity>
        <Text className="font-jakarta text-[18px] font-bold text-primary ml-4">
          Terms of Service
        </Text>
      </View>

      {/* Content */}
      <ScrollView 
        className="flex-1 px-5 py-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text className="font-jakarta text-[28px] font-bold text-primary mb-2 tracking-tight">
          Terms of Service
        </Text>
        <Text className="font-jakarta text-[13px] text-onSurfaceVariant/60 mb-6">
          Last Updated: July 30, 2026
        </Text>

        <View className="bg-surfaceContainerLow rounded-[20px] p-5 border border-surfaceVariant mb-6">
          <Text className="font-jakarta text-[16px] font-bold text-primary mb-1">
            Data Ownership & Responsibility
          </Text>
          <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant">
            All data created in Nimo resides locally on your device. We have no cloud backups and cannot recover your data if you delete the app or lose your device. You are solely responsible for protecting your device.
          </Text>
        </View>

        <View className="space-y-6">
          <View>
            <Text className="font-jakarta text-[18px] font-bold text-primary mb-2">
              1. Acceptance of Terms
            </Text>
            <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant">
              By downloading, installing, or using the Nimo application, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
            </Text>
          </View>

          <View>
            <Text className="font-jakarta text-[18px] font-bold text-primary mb-2">
              2. Description of Service
            </Text>
            <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant">
              Nimo is a local-first mindfulness and micro-journaling application designed to help you track habits, set intentions, and reflect on your days.
            </Text>
          </View>

          <View>
            <Text className="font-jakarta text-[18px] font-bold text-primary mb-2">
              3. Data Ownership and Local Storage
            </Text>
            <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant mb-4">
              All data created, recorded, or inputted by you in Nimo (including journal entries, streak dates, intentions) is stored locally on your device. We do not own, access, or control this data.
            </Text>
            
            <View className="bg-surfaceContainerLow rounded-xl p-4 border border-surfaceVariant mb-4">
              <Text className="font-jakarta text-[16px] font-bold text-primary mb-1">
                Google Sign-In & AI Features
              </Text>
              <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant mb-2">
                If you choose to use Google Sign-In, your basic profile information is saved securely on your device for personalizing your experience and enabling future personal cloud backups. We do not collect this on our servers.
              </Text>
              <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant">
                Additionally, all Artificial Intelligence (AI) features (like chat and semantic search) are executed locally on your device using on-device models. Your journal entries are never sent to third-party AI services.
              </Text>
            </View>

            <View className="bg-surfaceContainerLow rounded-xl p-4 border border-surfaceVariant">
              <Text className="font-jakarta text-[16px] font-bold text-primary mb-1">
                No Cloud Recovery
              </Text>
              <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant">
                Since we do not store your data on our servers, we have no way to recover your data if your device is lost, stolen, damaged, or if the Nimo app is uninstalled (unless you have explicitly configured a personal cloud backup). You are solely responsible for managing and safeguarding your device and data.
              </Text>
            </View>
          </View>

          <View>
            <Text className="font-jakarta text-[18px] font-bold text-primary mb-2">
              4. Disclaimer of Warranties
            </Text>
            <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant">
              The application is provided "as is" and "as available" without warranties of any kind, either express or implied. Nimo does not warrant that the application will be error-free or that data loss will not occur.
            </Text>
          </View>

          <View>
            <Text className="font-jakarta text-[18px] font-bold text-primary mb-2">
              5. Contact Us
            </Text>
            <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant">
              If you have any questions or feedback regarding these Terms, feel free to contact us at terms@nimo.app.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
