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
          Last Updated: July 30, 2026
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
            <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant mb-2">
              Nimo offers an optional Google Sign-In feature to personalize your experience and facilitate personal cloud backups (like Google Drive). When you sign in, we receive your basic profile information (name, email address, and profile picture).
            </Text>
            <Text className="font-jakarta text-[14px] leading-[22px] text-primary font-semibold mb-2">
              Crucially, this information is only stored locally on your device. We do not transmit, collect, or store this personal information on our remote servers.
            </Text>
            <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant">
              If you choose not to sign in, we do not collect any personal information. In all cases, your journal entries and reflections stay solely in your local database.
            </Text>
          </View>

          <View>
            <Text className="font-jakarta text-[18px] font-bold text-primary mb-2">
              2. Local Storage & AI Processing
            </Text>
            <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant mb-2">
              Your data is stored securely using local on-device database systems (SQLite and MMKV). This data can only be accessed through the Nimo application on your physical device.
            </Text>
            <Text className="font-jakarta text-[14px] leading-[22px] text-onSurfaceVariant">
              <Text className="font-bold text-primary">Local AI Guarantee:</Text> All AI features (including natural language chat and semantic search) process your journal entries entirely on your local device. Your private data is never sent to external AI servers (like OpenAI or Anthropic).
            </Text>
            <Text className="font-jakarta text-[14px] leading-[22px] text-primary font-semibold mt-2">
              Important: If you delete Nimo from your device without setting up personal cloud backups, all of your saved entries will be permanently lost, as we do not keep backups on our servers.
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
              If you have any questions or feedback regarding this Privacy Policy, feel free to contact us at ashok.d.paul@gmail.com.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
