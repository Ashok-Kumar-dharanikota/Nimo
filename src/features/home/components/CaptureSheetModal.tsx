import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface CaptureSheetModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (content: string, emotion?: string) => Promise<void> | void;
  isSaving?: boolean;
}

export function CaptureSheetModal({
  visible,
  onClose,
  onSave,
  isSaving = false,
}: CaptureSheetModalProps) {
  const [content, setContent] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [activeMedia, setActiveMedia] = useState<'photo' | 'video' | 'voice' | 'note'>('note');

  if (!visible) return null;

  const handleSave = async () => {
    const trimmed = content.trim();
    if (!trimmed || isSaving) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await onSave(trimmed, selectedFeeling || undefined);
    setContent('');
    setSelectedFeeling(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="flex-1 justify-end relative">
          {/* Backdrop Overlay */}
          <TouchableWithoutFeedback onPress={onClose}>
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              className="absolute inset-0 bg-[#1c1a17]/50"
            />
          </TouchableWithoutFeedback>

          {/* Bottom Sheet */}
          <Animated.View
            entering={SlideInDown.duration(300)}
            exiting={SlideOutDown.duration(250)}
            className="bg-[#fbf9f4] rounded-t-[36px] px-6 pt-3.5 pb-8 border-t border-[#e0d8cb] shadow-2xl z-50"
          >
            {/* Handle Bar */}
            <View className="w-11 h-1.5 rounded-full bg-[#e0d8cb] self-center mb-4" />

            {/* Header */}
            <Text className="font-playfair text-[26px] font-bold text-[#27170c] leading-tight mb-1">
              What happened{'\n'}today?
            </Text>
            <Text className="font-jakarta text-[13px] text-[#a89a8b] mb-4">
              Take a breath. Share your moment.
            </Text>

            {/* Input Box */}
            <TextInput
              className="w-full bg-white border border-[#ece5db] rounded-[20px] p-4 font-jakarta text-[14px] text-[#27170c] min-h-[90px] mb-4"
              placeholder="Share your moment…"
              placeholderTextColor="#b3a598"
              multiline
              textAlignVertical="top"
              value={content}
              onChangeText={setContent}
              autoFocus
            />

            {/* Media Type Option Row */}
            <View className="flex-row justify-between items-center my-2">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveMedia('photo');
                }}
                className="items-center gap-1.5 flex-1"
              >
                <View
                  className={`w-[50px] h-[50px] rounded-[18px] items-center justify-center ${
                    activeMedia === 'photo' ? 'bg-[#566434]' : 'bg-[#eef1e4]'
                  }`}
                >
                  <Feather name="camera" size={20} color={activeMedia === 'photo' ? '#fff' : '#566434'} />
                </View>
                <Text className="font-jakarta text-[11px] font-semibold text-[#8c7c6c]">Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveMedia('video');
                }}
                className="items-center gap-1.5 flex-1"
              >
                <View
                  className={`w-[50px] h-[50px] rounded-[18px] items-center justify-center ${
                    activeMedia === 'video' ? 'bg-[#b5651d]' : 'bg-[#f7ede2]'
                  }`}
                >
                  <Feather name="video" size={20} color={activeMedia === 'video' ? '#fff' : '#b5651d'} />
                </View>
                <Text className="font-jakarta text-[11px] font-semibold text-[#8c7c6c]">Video</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveMedia('voice');
                }}
                className="items-center gap-1.5 flex-1"
              >
                <View
                  className={`w-[50px] h-[50px] rounded-[18px] items-center justify-center ${
                    activeMedia === 'voice' ? 'bg-[#a3506a]' : 'bg-[#f2e7ea]'
                  }`}
                >
                  <Feather name="mic" size={20} color={activeMedia === 'voice' ? '#fff' : '#a3506a'} />
                </View>
                <Text className="font-jakarta text-[11px] font-semibold text-[#8c7c6c]">Voice</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveMedia('note');
                }}
                className="items-center gap-1.5 flex-1"
              >
                <View
                  className={`w-[50px] h-[50px] rounded-[18px] items-center justify-center ${
                    activeMedia === 'note' ? 'bg-[#8c7c6c]' : 'bg-[#eae3d6]'
                  }`}
                >
                  <Feather name="edit-3" size={20} color={activeMedia === 'note' ? '#fff' : '#8c7c6c'} />
                </View>
                <Text className="font-jakarta text-[11px] font-semibold text-[#8c7c6c]">Note</Text>
              </TouchableOpacity>
            </View>

            {/* Feelings Picker */}
            <View className="flex-row items-center gap-3 my-3">
              <Text className="font-jakarta text-[12px] font-semibold text-[#a89a8b]">Feeling</Text>
              <View className="flex-row gap-2.5">
                {['🌱', '🌻', '🪷', '🍄'].map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    activeOpacity={0.7}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedFeeling(selectedFeeling === emoji ? null : emoji);
                    }}
                    className={`w-[36px] h-[36px] rounded-full items-center justify-center border ${
                      selectedFeeling === emoji
                        ? 'bg-[#566434]/15 border-[#566434]'
                        : 'bg-[#eef1e4]/70 border-transparent'
                    }`}
                  >
                    <Text className="text-base">{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSave}
              disabled={!content.trim() || isSaving}
              className={`w-full py-4 rounded-[22px] bg-[#27170c] items-center justify-center mt-2 shadow-md ${
                !content.trim() || isSaving ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {isSaving ? (
                <ActivityIndicator color="#fbf9f4" />
              ) : (
                <Text className="font-jakarta text-[15px] font-bold text-[#fbf9f4]">
                  Plant this memory 🌱
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
