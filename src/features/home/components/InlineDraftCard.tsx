import { useDraftStore } from '@/store/draftStore';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import {
  Bookmark,
  CheckCircle,
  Coffee,
  Heart,
  Image as ImageIcon,
  PenTool,
  Smile,
  Sparkles,
  Sun,
  Video as VideoIcon,
  X,
  Plus,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useHomeData } from '../hooks/useHomeData';
import { useTaskData } from '../hooks/useTaskData';
import { formatTime } from '../utils/dateUtils';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { uploadMediaToSupabase } from '@/lib/storageService';

const FEELINGS = [
  { id: 'happy', label: 'Happy', Icon: Smile, color: '#566434', bg: '#eef1e4' },
  { id: 'inspired', label: 'Inspired', Icon: Sparkles, color: '#b5651d', bg: '#f7ede2' },
  { id: 'loved', label: 'Loved', Icon: Heart, color: '#a3506a', bg: '#f2e7ea' },
  { id: 'bright', label: 'Bright', Icon: Sun, color: '#d97706', bg: '#fef3c7' },
  { id: 'calm', label: 'Calm', Icon: Coffee, color: '#4f5c42', bg: '#eae3d6' },
];

const DEFAULT_TASKS = [
  'Disconnect for an hour',
  'Take a 15-minute mindful walk',
  'Write three things you are grateful for',
  'Reach out to an old friend',
  'Spend 10 minutes in silence',
  'Do a random act of kindness',
];

export function InlineDraftCard() {
  const router = useRouter();
  const {
    isEditing,
    draftId,
    title: storedTitle,
    content: storedContent,
    emotion: storedEmotion,
    mediaUri: storedMediaUri,
    mediaType: storedMediaType,
    createdAt: storedCreatedAt,
    updateDraft,
    clearDraft,
  } = useDraftStore();

  const { addQuickMoment, isAddingMoment } = useHomeData();
  const { todayTasks, setTodayTask } = useTaskData();

  const [activeTab, setActiveTab] = useState<'task' | 'moment'>('moment');
  const [customTask, setCustomTask] = useState('');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const [title, setTitle] = useState(storedTitle);
  const [content, setContent] = useState(storedContent);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(storedEmotion);
  const [mediaUri, setMediaUri] = useState<string | null>(storedMediaUri);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(storedMediaType);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setTitle(storedTitle);
    setContent(storedContent);
    setSelectedFeeling(storedEmotion);
    setMediaUri(storedMediaUri);
    setMediaType(storedMediaType);
  }, [storedTitle, storedContent, storedEmotion, storedMediaUri, storedMediaType]);

  useEffect(() => {
    if (isEditing) {
      const hasTasks = todayTasks && todayTasks.length > 0;
      if (!hasTasks) {
        setActiveTab('task');
      }
    }
  }, [isEditing, todayTasks]);

  const handleSelectTask = async (taskTitle: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSubmittingTask(true);
    try {
      await setTodayTask(taskTitle);
      setActiveTab('moment');
    } catch (e) {
      console.error(e);
    }
    setIsSubmittingTask(false);
  };

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

  const pickMedia = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const uri = asset.uri;
        const type: 'photo' | 'video' = asset.type === 'video' ? 'video' : 'photo';
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
    updateDraft({ mediaUri: null, mediaType: null });
  };

  const handlePlantMoment = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent && !mediaUri) return;

    try {
      setIsUploading(true);
      
      let finalMediaUri = mediaUri;
      if (mediaUri && mediaUri.startsWith('file://')) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          finalMediaUri = await uploadMediaToSupabase(mediaUri, mediaType || 'photo', session.user.id);
        }
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await addQuickMoment({
        id: draftId,
        content: trimmedContent || (mediaType === 'video' ? 'Recorded a video' : 'Captured a photo'),
        emotion: selectedFeeling || undefined,
        title: title.trim() || undefined,
        mediaUri: finalMediaUri || undefined,
        mediaType: mediaType || undefined,
        isDraft: false,
      });
      clearDraft();
    } catch (e: any) {
      if (e.message === 'LIMIT_REACHED') {
        router.push('/paywall');
      } else {
        console.error('Error saving moment:', e);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent && !mediaUri && !title.trim()) {
      clearDraft();
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await addQuickMoment({
      id: draftId,
      content: trimmedContent || (mediaType === 'video' ? 'Recorded a video' : 'Captured a photo'),
      emotion: selectedFeeling || undefined,
      title: title.trim() || undefined,
      mediaUri: mediaUri || undefined,
      mediaType: mediaType || undefined,
      isDraft: true,
    });

    clearDraft();
  };

  if (!isEditing) return null;

  const selectedFeelingObj = FEELINGS.find((f) => f.id === selectedFeeling);
  const SelectedFeelingIcon = selectedFeelingObj?.Icon;
  const draftTime = storedCreatedAt ? formatTime(storedCreatedAt) : formatTime(new Date().toISOString());

  return (
    <Animated.View
      entering={FadeInDown.duration(350)}
      exiting={FadeOutUp.duration(250)}
      style={styles.timelineRow}
    >
      {/* Thread Node Circle on Left */}
      <View style={styles.threadNodeCol}>
        <View style={styles.threadDot}>
          <PenTool size={14} color="#566434" />
        </View>
      </View>

      {/* Main Card Content on Right (takes same flex-1 size of normal cards) */}
      <View style={styles.cardContentCol}>
        {/* Creation Timestamp Header */}
        <Text style={styles.timestampText}>{draftTime}</Text>

        <View style={styles.cardContainer}>
          {/* Card Header Badge & Discard */}
          {/* Tab Selector & Discard */}
          <View style={[styles.cardHeader, { marginBottom: 16 }]}>
            <View style={{ flexDirection: 'row', backgroundColor: '#eef1e4', padding: 4, borderRadius: 24, borderWidth: 1, borderColor: '#dce3ca' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setActiveTab('task')}
                style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: activeTab === 'task' ? '#566434' : 'transparent' }}
              >
                <Text style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: '700', color: activeTab === 'task' ? 'white' : '#566434' }}>
                  Tiny Task
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (!todayTasks || todayTasks.length === 0) return; // Prevent switching if no task
                  setActiveTab('moment');
                }}
                style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: activeTab === 'moment' ? '#566434' : 'transparent', opacity: (!todayTasks || todayTasks.length === 0) ? 0.5 : 1 }}
              >
                <Text style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: '700', color: activeTab === 'moment' ? 'white' : '#566434' }}>
                  Moment
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={clearDraft} activeOpacity={0.7} style={styles.discardIconBtn}>
              <X size={16} color="#8c7c6c" />
            </TouchableOpacity>
          </View>

          {activeTab === 'task' ? (
            <View>
              <Text style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: '#8c7c6c', marginBottom: 12 }}>
                Set a tiny task to unlock your garden today.
              </Text>
              
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {DEFAULT_TASKS.map((t) => (
                  <TouchableOpacity key={t} activeOpacity={0.7} onPress={() => handleSelectTask(t)} style={{ backgroundColor: '#f0eee9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#e4e2dd' }}>
                    <Text style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: '#6b5d51' }}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                  style={{ flex: 1, backgroundColor: '#f0eee9', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 13, fontFamily: 'Plus Jakarta Sans', color: '#27170c' }}
                  placeholder="Or write your own..."
                  placeholderTextColor="#a89a8b"
                  value={customTask}
                  onChangeText={setCustomTask}
                />
                <TouchableOpacity 
                  disabled={!customTask.trim() || isSubmittingTask} 
                  onPress={() => handleSelectTask(customTask.trim())}
                  style={[{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#566434', alignItems: 'center', justifyContent: 'center' }, !customTask.trim() ? { opacity: 0.5 } : null]}
                >
                  <Plus size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>

          {/* Attached Media Preview */}
          {mediaUri ? (
            <View style={styles.mediaPreviewContainer}>
              {mediaType === 'photo' ? (
                <Image source={{ uri: mediaUri }} style={styles.mediaImage} resizeMode="cover" />
              ) : (
                <View style={styles.videoPlaceholder}>
                  <VideoIcon size={24} color="#ffffff" />
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

          {/* Attachment Action Button (Combined Media, Pen/Note removed) */}
          <View style={styles.attachmentBar}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={pickMedia}
              style={[styles.attachBtn, mediaUri ? styles.attachBtnActive : null]}
            >
              <ImageIcon size={17} color={mediaUri ? '#ffffff' : '#566434'} />
              <Text style={[styles.attachBtnText, mediaUri ? styles.attachBtnTextActive : null]}>
                {mediaUri ? (mediaType === 'video' ? 'Video Attached' : 'Photo Attached') : 'Add Photo / Video'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Feeling Header (shows text & icon next to Feeling label) */}
          <View style={styles.feelingsRow}>
            <View style={styles.feelingsLabelRow}>
              <Text style={styles.feelingsLabel}>Feeling:</Text>
              {selectedFeelingObj && SelectedFeelingIcon ? (
                <View style={styles.selectedFeelingDisplay}>
                  <SelectedFeelingIcon size={14} color={selectedFeelingObj.color} />
                  <Text style={[styles.selectedFeelingText, { color: selectedFeelingObj.color }]}>
                    {selectedFeelingObj.label}
                  </Text>
                </View>
              ) : (
                <Text style={styles.noFeelingText}>Select a feeling</Text>
              )}
            </View>

            {/* Feelings List (Icons ONLY, text removed) */}
            <View style={styles.feelingsContainer}>
              {FEELINGS.map(({ id, Icon, color }) => {
                const isSelected = selectedFeeling === id;
                return (
                  <TouchableOpacity
                    key={id}
                    activeOpacity={0.7}
                    onPress={() => handleFeelingSelect(id)}
                    style={[
                      styles.feelingIconButton,
                      isSelected
                        ? { backgroundColor: '#56643418', borderColor: '#566434', borderWidth: 2 }
                        : { backgroundColor: '#fbf9f4', borderColor: '#e4e2dd' },
                    ]}
                  >
                    <Icon size={18} color={isSelected ? '#566434' : color} />
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
              <Bookmark size={15} color="#4f453f" />
              <Text style={styles.saveDraftBtnText}>Save Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handlePlantMoment}
              disabled={(!content.trim() && !mediaUri) || isAddingMoment || isUploading}
              style={[
                styles.plantBtn,
                ((!content.trim() && !mediaUri) || isAddingMoment || isUploading) && styles.disabledPlantBtn,
              ]}
            >
              {isAddingMoment || isUploading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={styles.plantBtnText}>{isUploading ? 'Uploading...' : 'Saving...'}</Text>
                </View>
              ) : (
                <>
                  <CheckCircle size={15} color="white" />
                  <Text style={styles.plantBtnText}>Plant Moment</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          </View>
        )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  threadNodeCol: {
    width: 28,
    alignItems: 'center',
    paddingTop: 2,
    flexShrink: 0,
  },
  threadDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eef1e4',
    borderWidth: 2,
    borderColor: '#c7d2ab',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContentCol: {
    flex: 1,
  },
  timestampText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#a89a8b',
    marginBottom: 8,
    fontFamily: 'Plus Jakarta Sans',
  },
  cardContainer: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#56643440',
    borderStyle: 'dashed',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  editingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef1e4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5,
  },
  editingPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#566434',
  },
  editingBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#566434',
    fontFamily: 'Plus Jakarta Sans',
    textTransform: 'uppercase',
  },
  discardIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0eee9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaPreviewContainer: {
    height: 110,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
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
    gap: 4,
  },
  videoPlaceholderText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },
  removeMediaBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleInput: {
    fontSize: 16,
    fontWeight: '700',
    color: '#27170c',
    fontFamily: 'Playfair Display',
    backgroundColor: '#fbf9f4',
    borderWidth: 1,
    borderColor: '#efe9e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  contentInput: {
    fontSize: 13.5,
    color: '#27170c',
    fontFamily: 'Plus Jakarta Sans',
    backgroundColor: '#fbf9f4',
    borderWidth: 1,
    borderColor: '#efe9e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 70,
    marginBottom: 10,
  },
  attachmentBar: {
    flexDirection: 'row',
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
    marginBottom: 14,
  },
  feelingsLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  feelingsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a89a8b',
    fontFamily: 'Plus Jakarta Sans',
  },
  selectedFeelingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f5f3ec',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  selectedFeelingText: {
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  noFeelingText: {
    fontSize: 11.5,
    color: '#a89a8b',
    fontStyle: 'italic',
    fontFamily: 'Plus Jakarta Sans',
  },
  feelingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  feelingIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  saveDraftBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#f0eee9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  saveDraftBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#4f453f',
    fontFamily: 'Plus Jakarta Sans',
  },
  plantBtn: {
    flex: 1.2,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#566434',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  disabledPlantBtn: {
    opacity: 0.5,
  },
  plantBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Plus Jakarta Sans',
  },
});
