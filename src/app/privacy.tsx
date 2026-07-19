import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyNative() {
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
          Privacy Policy
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-5 py-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text className="font-jakarta text-[28px] font-bold text-primary mb-2 tracking-tight">
          Privacy Policy
        </Text>
        <Text className="font-jakarta text-[13px] text-onSurfaceVariant/60 mb-6">
          Last Updated: July 5, 2026
        </Text>

        <View className="bg-surfaceContainerLow rounded-[20px] p-5 border border-surfaceVariant mb-6">
          <Text className="font-jakarta text-[16px] font-bold text-primary mb-1">
            Local-First Privacy Guard
          </Text>
          <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant">
            Nimo is built as a local-first application. This means all of your journal entries, streak counts, intentions, and mindful reflections are stored entirely on your physical device. We do not transmit, sync, or backup your personal data to remote servers.
          </Text>
        </View>

        <View className="space-y-6">
          <View>
            <Text className="font-jakarta text-[18px] font-bold text-primary mb-2">
              1. Information We Collect
            </Text>
            <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant">
              Because Nimo runs fully locally on your device, we do not require you to create an account, register, or provide an email address. We do not collect or store any of your private reflections or journaling behavior.
            </Text>
          </View>

          <View>
            <Text className="font-jakarta text-[18px] font-bold text-primary mb-2">
              2. Local Storage
            </Text>
            <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant">
              Your data is stored securely using local on-device database systems (SQLite and MMKV). This data can only be accessed through the Nimo application on your physical device.
            </Text>
            <Text className="font-jakarta text-[14px] leading-[22px] text-primary font-semibold mt-2">
              Important: If you delete Nimo from your device, all of your saved entries will be permanently lost, as we do not keep backups on our servers.
            </Text>
          </View>

          <View>
            <Text className="font-jakarta text-[18px] font-bold text-primary mb-2">
              3. Security
            </Text>
            <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant">
              Since your data resides entirely on your device, we recommend setting a secure PIN/passcode or utilizing biometric lock features on your phone to prevent unauthorized access.
            </Text>
          </View>

          <View>
            <Text className="font-jakarta text-[18px] font-bold text-primary mb-2">
              4. Contact Us
            </Text>
            <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant">
              If you have any questions or feedback regarding this Privacy Policy, feel free to contact us at privacy@nimo.app.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
