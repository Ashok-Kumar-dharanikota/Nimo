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
  Image,
} from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import {
  Smile,
  Sparkles,
  Heart,
  Sun,
  Coffee,
  Image as ImageIcon,
  Video as VideoIcon,
  Edit3,
  X,
} from 'lucide-react-native';

interface CaptureSheetModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (content: string, emotion?: string, mediaUri?: string, mediaType?: 'photo' | 'video', title?: string) => Promise<void> | void;
  isSaving?: boolean;
}

const FEELINGS = [
  { id: 'happy', label: 'Happy', Icon: Smile, color: '#566434', bg: '#eef1e4' },
  { id: 'inspired', label: 'Inspired', Icon: Sparkles, color: '#b5651d', bg: '#f7ede2' },
  { id: 'loved', label: 'Loved', Icon: Heart, color: '#a3506a', bg: '#f2e7ea' },
  { id: 'bright', label: 'Bright', Icon: Sun, color: '#d97706', bg: '#fef3c7' },
  { id: 'calm', label: 'Calm', Icon: Coffee, color: '#4f5c42', bg: '#eae3d6' },
];

export function CaptureSheetModal({
  visible,
  onClose,
  onSave,
  isSaving = false,
}: CaptureSheetModalProps) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [activeMedia, setActiveMedia] = useState<'photo' | 'video' | 'note'>('note');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(null);

  if (!visible) return null;

  const pickMedia = async (type: 'photo' | 'video') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveMedia(type);

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: type === 'photo' 
          ? ImagePicker.MediaTypeOptions.Images 
          : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setMediaUri(result.assets[0].uri);
        setMediaType(type);
      }
    } catch (err) {
      console.error('Error picking media:', err);
    }
  };

  const removeMedia = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMediaUri(null);
    setMediaType(null);
    setActiveMedia('note');
  };

  const handleSave = async () => {
    const trimmed = content.trim();
    if (!trimmed && !mediaUri) return;
    if (isSaving) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await onSave(
      trimmed || (mediaType === 'video' ? 'Recorded a video' : 'Captured a photo'),
      selectedFeeling || undefined,
      mediaUri || undefined,
      mediaType || undefined,
      title.trim() || undefined
    );

    // Reset form state
    setContent('');
    setTitle('');
    setSelectedFeeling(null);
    setMediaUri(null);
    setMediaType(null);
    setActiveMedia('note');
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

            {/* Selected Media Preview (if user picked an image or video from phone) */}
            {mediaUri ? (
              <View className="relative mb-3 rounded-[20px] overflow-hidden border border-[#ece5db] bg-[#1c1a17] h-[130px] justify-center items-center">
                {mediaType === 'photo' ? (
                  <Image source={{ uri: mediaUri }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <View className="items-center gap-2">
                    <VideoIcon size={32} color="#ffffff" />
                    <Text className="font-jakarta text-xs font-semibold text-white/80">Video selected from phone</Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={removeMedia}
                  activeOpacity={0.8}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 items-center justify-center border border-white/20"
                >
                  <X size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Title Input */}
            <TextInput
              className="w-full bg-white border border-[#ece5db] rounded-[20px] px-4 py-3 font-playfair text-[17px] font-semibold text-[#27170c] mb-2"
              placeholder="Give it a title…"
              placeholderTextColor="#c4b8aa"
              value={title}
              onChangeText={setTitle}
              returnKeyType="next"
            />

            {/* Content Input */}
            <TextInput
              className="w-full bg-white border border-[#ece5db] rounded-[20px] p-4 font-jakarta text-[14px] text-[#27170c] min-h-[90px] mb-3"
              placeholder="Share your moment…"
              placeholderTextColor="#b3a598"
              multiline
              textAlignVertical="top"
              value={content}
              onChangeText={setContent}
              autoFocus={!mediaUri}
            />

            {/* Media Type Option Row (Photo, Video, Note - Audio Removed) */}
            <View className="flex-row justify-around items-center my-2 bg-white/60 p-2 rounded-[22px] border border-[#efe9e1]">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => pickMedia('photo')}
                className="items-center gap-1 flex-1 py-1"
              >
                <View
                  className={`w-[46px] h-[46px] rounded-[16px] items-center justify-center ${
                    activeMedia === 'photo' ? 'bg-[#566434]' : 'bg-[#eef1e4]'
                  }`}
                >
                  <ImageIcon size={20} color={activeMedia === 'photo' ? '#fff' : '#566434'} />
                </View>
                <Text className="font-jakarta text-[11px] font-semibold text-[#8c7c6c]">Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => pickMedia('video')}
                className="items-center gap-1 flex-1 py-1"
              >
                <View
                  className={`w-[46px] h-[46px] rounded-[16px] items-center justify-center ${
                    activeMedia === 'video' ? 'bg-[#b5651d]' : 'bg-[#f7ede2]'
                  }`}
                >
                  <VideoIcon size={20} color={activeMedia === 'video' ? '#fff' : '#b5651d'} />
                </View>
                <Text className="font-jakarta text-[11px] font-semibold text-[#8c7c6c]">Video</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveMedia('note');
                }}
                className="items-center gap-1 flex-1 py-1"
              >
                <View
                  className={`w-[46px] h-[46px] rounded-[16px] items-center justify-center ${
                    activeMedia === 'note' ? 'bg-[#8c7c6c]' : 'bg-[#eae3d6]'
                  }`}
                >
                  <Edit3 size={20} color={activeMedia === 'note' ? '#fff' : '#8c7c6c'} />
                </View>
                <Text className="font-jakarta text-[11px] font-semibold text-[#8c7c6c]">Note</Text>
              </TouchableOpacity>
            </View>

            {/* Feelings Picker using Lucide icons */}
            <View className="flex-row items-center gap-2.5 my-3">
              <Text className="font-jakarta text-[12px] font-semibold text-[#a89a8b]">Feeling</Text>
              <View className="flex-row gap-2 flex-1 justify-between">
                {FEELINGS.map(({ id, label, Icon, color, bg }) => {
                  const isSelected = selectedFeeling === id;
                  return (
                    <TouchableOpacity
                      key={id}
                      activeOpacity={0.7}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSelectedFeeling(isSelected ? null : id);
                      }}
                      className={`flex-row items-center gap-1 px-3 py-2 rounded-full border ${
                        isSelected
                          ? 'border-[#566434] bg-[#566434]/15'
                          : 'border-transparent bg-white'
                      }`}
                    >
                      <Icon size={16} color={isSelected ? '#566434' : color} />
                      <Text
                        className={`font-jakarta text-[11px] font-semibold ${
                          isSelected ? 'text-[#566434]' : 'text-[#8c7c6c]'
                        }`}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSave}
              disabled={(!content.trim() && !mediaUri) || isSaving}
              className={`w-full py-4 rounded-[22px] bg-[#27170c] items-center justify-center mt-2 shadow-md ${
                (!content.trim() && !mediaUri) || isSaving ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {isSaving ? (
                <ActivityIndicator color="#fbf9f4" />
              ) : (
                <Text className="font-jakarta text-[15px] font-bold text-[#fbf9f4]">
                  Plant this memory
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
