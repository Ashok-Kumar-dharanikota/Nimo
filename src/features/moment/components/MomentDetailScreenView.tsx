import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, CheckCircle, Circle, Sparkle, Edit3, Trash2 } from 'lucide-react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { MomentVideoPlayer } from '@/features/home/components/MomentVideoPlayer';
import { formatTime, parseSQLiteDate } from '@/features/home/utils/dateUtils';
import { draftStore } from '@/store/draftStore';
import { useHomeData } from '@/features/home/hooks/useHomeData';
import { useMomentDetail } from '../hooks/useMomentDetail';
import { MOMENT_EMOTION_MAP } from '../utils/momentConstants';

export function MomentDetailScreenView({ momentId }: { momentId?: string | number }) {
  const router = useRouter();
  const { momentData, taskCompleted, isLoading } = useMomentDetail(momentId);
  const { deleteMoment } = useHomeData();

  if (isLoading || !momentData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={20} color="#4f453f" />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.metaHeader}>
            <Skeleton className="w-32 h-4 rounded bg-[#f0eee9]" />
            <View style={styles.metaRowRight}>
              <Skeleton className="w-24 h-6 rounded-full bg-[#f0eee9]" />
              <Skeleton className="w-20 h-6 rounded-full bg-[#f0eee9]" />
            </View>
          </View>
          <Skeleton className="w-3/4 h-8 rounded mb-6 bg-[#f0eee9]" />
          <Skeleton className="w-full aspect-square rounded-[24px] mb-6 bg-[#f0eee9]" />
          <Skeleton className="w-full h-4 rounded mb-2 bg-[#f0eee9]" />
          <Skeleton className="w-full h-4 rounded mb-2 bg-[#f0eee9]" />
          <Skeleton className="w-5/6 h-4 rounded mb-2 bg-[#f0eee9]" />
          <Skeleton className="w-4/6 h-4 rounded bg-[#f0eee9]" />
        </View>
      </SafeAreaView>
    );
  }

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    draftStore.editDraftMoment({
      id: momentData.id,
      title: momentData.title,
      content: momentData.content,
      emotion: momentData.emotion,
      mediaUri: momentData.mediaUri,
      mediaType: momentData.mediaType,
      createdAt: momentData.createdAt,
    });
    router.push('/compose');
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Delete Reflection',
      'Are you sure you want to delete this reflection? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMoment(momentData.id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.back();
            } catch (err) {
              console.error('Failed to delete moment:', err);
            }
          },
        },
      ]
    );
  };

  const emotionConfig = (momentData.emotion && MOMENT_EMOTION_MAP[momentData.emotion]) || {
    Icon: Sparkle,
    color: '#566434',
    bg: '#eef1e4',
    label: 'Moment',
  };
  const EmotionIcon = emotionConfig.Icon;
  const displayTitle = momentData.title || momentData.journalTitle;
  const timeStr = formatTime(momentData.createdAt);
  const dateObj = parseSQLiteDate(momentData.createdAt);
  const dateStr = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backButton}
        >
          <ArrowLeft size={20} color="#4f453f" />
        </TouchableOpacity>

        {/* Edit & Delete Action Buttons */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleEdit}
            style={styles.actionButton}
          >
            <Edit3 size={17} color="#566434" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleDelete}
            style={[styles.actionButton, styles.deleteButton]}
          >
            <Trash2 size={17} color="#c2410c" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.metaHeader}>
          <Text style={styles.dateText}>
            {dateStr} at {timeStr}
          </Text>

          <View style={styles.metaRowRight}>
            {taskCompleted !== null && (
              <View style={styles.taskIndicator}>
                {taskCompleted ? (
                  <CheckCircle size={14} color="#566434" />
                ) : (
                  <Circle size={14} color="#b5651d" />
                )}
                <Text style={[styles.taskText, { color: taskCompleted ? '#566434' : '#b5651d' }]}>
                  {taskCompleted ? 'Daily Task Completed' : 'Daily Task Incomplete'}
                </Text>
              </View>
            )}

            <View style={[styles.emotionBadge, { backgroundColor: emotionConfig.bg }]}>
              <EmotionIcon size={12} color={emotionConfig.color} />
              <Text style={[styles.emotionText, { color: emotionConfig.color }]}>
                {emotionConfig.label}
              </Text>
            </View>
          </View>
        </View>

        {displayTitle && <Text style={styles.title}>{displayTitle}</Text>}

        {momentData.mediaUri && (
          <View style={styles.mediaContainer}>
            {momentData.mediaType === 'video' ? (
              <MomentVideoPlayer uri={momentData.mediaUri} aspectRatio={1} />
            ) : (
              <Image
                source={{ uri: momentData.mediaUri }}
                style={styles.mediaImage}
                resizeMode="cover"
              />
            )}
          </View>
        )}

        <Text style={styles.content}>{momentData.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf9f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0eee9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#eef1e4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#ffedd5',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  metaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  dateText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    color: '#8c7c6c',
    fontWeight: '500',
  },
  metaRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0eee9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  taskText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '600',
  },
  emotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emotionText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontFamily: 'Playfair Display',
    fontSize: 26,
    fontWeight: '700',
    color: '#27170c',
    marginBottom: 16,
    lineHeight: 34,
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1c1a17',
    marginBottom: 20,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    lineHeight: 26,
    color: '#4f453f',
  },
});
