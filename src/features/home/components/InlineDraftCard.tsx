import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
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
  Bookmark,
  CheckCircle,
} from 'lucide-react-native';
import { useDraftStore } from '@/store/draftStore';
import { useHomeData } from '../hooks/useHomeData';

const FEELINGS = [
  { id: 'happy', label: 'Happy', Icon: Smile, color: '#566434', bg: '#eef1e4' },
  { id: 'inspired', label: 'Inspired', Icon: Sparkles, color: '#b5651d', bg: '#f7ede2' },
  { id: 'loved', label: 'Loved', Icon: Heart, color: '#a3506a', bg: '#f2e7ea' },
  { id: 'bright', label: 'Bright', Icon: Sun, color: '#d97706', bg: '#fef3c7' },
  { id: 'calm', label: 'Calm', Icon: Coffee, color: '#4f5c42', bg: '#eae3d6' },
];

export function InlineDraftCard() {
  const {
    isEditing,
    title: storedTitle,
    content: storedContent,
    emotion: storedEmotion,
    mediaUri: storedMediaUri,
    mediaType: storedMediaType,
    isDraftSaved,
    updateDraft,
    saveAsDraft,
    clearDraft,
  } = useDraftStore();

  const { addQuickMoment, isAddingMoment } = useHomeData();

  const [title, setTitle] = useState(storedTitle);
  const [content, setContent] = useState(storedContent);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(storedEmotion);
  const [mediaUri, setMediaUri] = useState<string | null>(storedMediaUri);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(storedMediaType);
  const [activeMedia, setActiveMedia] = useState<'photo' | 'video' | 'note'>('note');

  useEffect(() => {
    setTitle(storedTitle);
    setContent(storedContent);
    setSelectedFeeling(storedEmotion);
    setMediaUri(storedMediaUri);
    setMediaType(storedMediaType);
  }, [storedTitle, storedContent, storedEmotion, storedMediaUri, storedMediaType]);

  // Sync state changes with local draftStore
  const handleTitleChange = (val: string) => {
    setTitle(val);
    updateDraft({ title: val });
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    updateDraft({ content: val });
  };

  const handleFeelingSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = selectedFeeling === id ? null : id;
    setSelectedFeeling(next);
    updateDraft({ emotion: next });
  };

  const pickMedia = async (type: 'photo' | 'video') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveMedia(type);

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          type === 'photo'
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setMediaUri(uri);
        setMediaType(type);
        updateDraft({ mediaUri: uri, mediaType: type });
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
    updateDraft({ mediaUri: null, mediaType: null });
  };

  const handlePlantMoment = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent && !mediaUri) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addQuickMoment({
      content: trimmedContent || (mediaType === 'video' ? 'Recorded a video' : 'Captured a photo'),
      emotion: selectedFeeling || undefined,
      title: title.trim() || undefined,
      mediaUri: mediaUri || undefined,
      mediaType: mediaType || undefined,
    });

    clearDraft();
  };

  const handleSaveAsDraft = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    saveAsDraft();
  };

  // If not editing and draft was saved as draft, render collapsed Draft Banner
  if (!isEditing && isDraftSaved) {
    return (
      <Animated.View
        entering={FadeInDown.duration(300)}
        exiting={FadeOutUp.duration(200)}
        style={styles.collapsedCard}
      >
        <View style={styles.collapsedHeader}>
          <View style={styles.draftBadge}>
            <Bookmark size={12} color="#566434" />
            <Text style={styles.draftBadgeText}>Saved Draft</Text>
          </View>
          <TouchableOpacity onPress={clearDraft} activeOpacity={0.7} style={styles.discardIconBtn}>
            <X size={16} color="#8c7c6c" />
          </TouchableOpacity>
        </View>

        <Text style={styles.collapsedTitle} numberOfLines={1}>
          {title || 'Untitled Moment Draft'}
        </Text>
        <Text style={styles.collapsedDesc} numberOfLines={2}>
          {content || 'Tap to complete and plant this moment.'}
        </Text>

        <TouchableOpacity
          onPress={() => useDraftStore().startDraft()}
          activeOpacity={0.8}
          style={styles.resumeBtn}
        >
          <Edit3 size={15} color="#566434" />
          <Text style={styles.resumeBtnText}>Continue Editing Draft</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (!isEditing) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(350)}
      exiting={FadeOutUp.duration(250)}
      style={styles.cardContainer}
    >
      {/* Top Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.editingBadge}>
          <View style={styles.editingPulseDot} />
          <Text style={styles.editingBadgeText}>New Moment</Text>
        </View>

        <TouchableOpacity onPress={clearDraft} activeOpacity={0.7} style={styles.discardIconBtn}>
          <X size={18} color="#8c7c6c" />
        </TouchableOpacity>
      </View>

      {/* Media Preview if attached */}
      {mediaUri ? (
        <View style={styles.mediaPreviewContainer}>
          {mediaType === 'photo' ? (
            <Image source={{ uri: mediaUri }} style={styles.mediaImage} resizeMode="cover" />
          ) : (
            <View style={styles.videoPlaceholder}>
              <VideoIcon size={28} color="#ffffff" />
              <Text style={styles.videoPlaceholderText}>Video Attached</Text>
            </View>
          )}
          <TouchableOpacity onPress={removeMedia} activeOpacity={0.8} style={styles.removeMediaBtn}>
            <X size={14} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Title Input */}
      <TextInput
        style={styles.titleInput}
        placeholder="Give your moment a title…"
        placeholderTextColor="#a89a8b"
        value={title}
        onChangeText={handleTitleChange}
        returnKeyType="next"
      />

      {/* Content Input */}
      <TextInput
        style={styles.contentInput}
        placeholder="What's on your mind? Capture your reflection…"
        placeholderTextColor="#b3a598"
        multiline
        textAlignVertical="top"
        value={content}
        onChangeText={handleContentChange}
      />

      {/* Attachment Options Row */}
      <View style={styles.attachmentBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => pickMedia('photo')}
          style={[styles.attachBtn, activeMedia === 'photo' && styles.attachBtnActive]}
        >
          <ImageIcon size={18} color={activeMedia === 'photo' ? '#ffffff' : '#566434'} />
          <Text
            style={[styles.attachBtnText, activeMedia === 'photo' && styles.attachBtnTextActive]}
          >
            Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => pickMedia('video')}
          style={[styles.attachBtn, activeMedia === 'video' && styles.attachBtnActiveVideo]}
        >
          <VideoIcon size={18} color={activeMedia === 'video' ? '#ffffff' : '#b5651d'} />
          <Text
            style={[
              styles.attachBtnText,
              activeMedia === 'video' && styles.attachBtnTextActive,
            ]}
          >
            Video
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveMedia('note')}
          style={[styles.attachBtn, activeMedia === 'note' && styles.attachBtnActiveNote]}
        >
          <Edit3 size={18} color={activeMedia === 'note' ? '#ffffff' : '#8c7c6c'} />
          <Text
            style={[styles.attachBtnText, activeMedia === 'note' && styles.attachBtnTextActive]}
          >
            Note
          </Text>
        </TouchableOpacity>
      </View>

      {/* Feelings Selector */}
      <View style={styles.feelingsRow}>
        <Text style={styles.feelingsLabel}>Feeling:</Text>
        <View style={styles.feelingsContainer}>
          {FEELINGS.map(({ id, label, Icon, color, bg }) => {
            const isSelected = selectedFeeling === id;
            return (
              <TouchableOpacity
                key={id}
                activeOpacity={0.7}
                onPress={() => handleFeelingSelect(id)}
                style={[
                  styles.feelingPill,
                  isSelected
                    ? { backgroundColor: '#56643418', borderColor: '#566434' }
                    : { backgroundColor: '#fbf9f4', borderColor: '#e4e2dd' },
                ]}
              >
                <Icon size={14} color={isSelected ? '#566434' : color} />
                <Text style={[styles.feelingPillText, isSelected && { color: '#566434', fontWeight: '700' }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSaveAsDraft}
          style={styles.saveDraftBtn}
        >
          <Bookmark size={16} color="#4f453f" />
          <Text style={styles.saveDraftBtnText}>Save as Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePlantMoment}
          disabled={(!content.trim() && !mediaUri) || isAddingMoment}
          style={[
            styles.plantBtn,
            ((!content.trim() && !mediaUri) || isAddingMoment) && styles.disabledPlantBtn,
          ]}
        >
          {isAddingMoment ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <CheckCircle size={16} color="white" />
              <Text style={styles.plantBtnText}>Plant Moment</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#56643440',
    marginBottom: 20,
    shadowColor: '#566434',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  editingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef1e4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  editingPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#566434',
  },
  editingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#566434',
    fontFamily: 'Plus Jakarta Sans',
    textTransform: 'uppercase',
  },
  discardIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0eee9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaPreviewContainer: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#1c1a17',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  videoPlaceholderText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },
  removeMediaBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27170c',
    fontFamily: 'Playfair Display',
    backgroundColor: '#fbf9f4',
    borderWidth: 1,
    borderColor: '#efe9e1',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  contentInput: {
    fontSize: 14,
    color: '#27170c',
    fontFamily: 'Plus Jakarta Sans',
    backgroundColor: '#fbf9f4',
    borderWidth: 1,
    borderColor: '#efe9e1',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 80,
    marginBottom: 12,
  },
  attachmentBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  attachBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fbf9f4',
    borderWidth: 1,
    borderColor: '#e4e2dd',
    borderRadius: 12,
    paddingVertical: 8,
  },
  attachBtnActive: {
    backgroundColor: '#566434',
    borderColor: '#566434',
  },
  attachBtnActiveVideo: {
    backgroundColor: '#b5651d',
    borderColor: '#b5651d',
  },
  attachBtnActiveNote: {
    backgroundColor: '#8c7c6c',
    borderColor: '#8c7c6c',
  },
  attachBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4f453f',
    fontFamily: 'Plus Jakarta Sans',
  },
  attachBtnTextActive: {
    color: '#ffffff',
  },
  feelingsRow: {
    marginBottom: 16,
  },
  feelingsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a89a8b',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: 6,
  },
  feelingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  feelingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  feelingPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b5e52',
    fontFamily: 'Plus Jakarta Sans',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  saveDraftBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#f0eee9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveDraftBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f453f',
    fontFamily: 'Plus Jakarta Sans',
  },
  plantBtn: {
    flex: 1.2,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#566434',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  disabledPlantBtn: {
    opacity: 0.5,
  },
  plantBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Plus Jakarta Sans',
  },
  // Collapsed Draft Banner
  collapsedCard: {
    backgroundColor: '#fbf9f4',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#56643460',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  collapsedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  draftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eef1e4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  draftBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#566434',
    fontFamily: 'Plus Jakarta Sans',
  },
  collapsedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#27170c',
    fontFamily: 'Playfair Display',
    marginBottom: 4,
  },
  collapsedDesc: {
    fontSize: 13,
    color: '#6b5e52',
    fontFamily: 'Plus Jakarta Sans',
    lineHeight: 18,
    marginBottom: 10,
  },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dde5cc',
    borderRadius: 12,
    paddingVertical: 8,
  },
  resumeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#566434',
    fontFamily: 'Plus Jakarta Sans',
  },
});
