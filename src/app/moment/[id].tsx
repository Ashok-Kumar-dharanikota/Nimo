import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, Circle, Coffee, Heart, Smile, Sparkle, Sparkles, Sun } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { db } from '@/db';
import { journal, moment, dailyTask } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { MomentVideoPlayer } from '@/features/home/components/MomentVideoPlayer';
import { formatTime, parseSQLiteDate } from '@/features/home/utils/dateUtils';
import { StatusBar } from 'expo-status-bar';
import { Skeleton } from '@/components/ui/skeleton';
const EMOTION_ICON_MAP: Record<string, { Icon: any; color: string; bg: string; label: string }> = {
  happy: { Icon: Smile, color: '#566434', bg: '#eef1e4', label: 'Happy' },
  inspired: { Icon: Sparkles, color: '#b5651d', bg: '#f7ede2', label: 'Inspired' },
  loved: { Icon: Heart, color: '#a3506a', bg: '#f2e7ea', label: 'Loved' },
  bright: { Icon: Sun, color: '#d97706', bg: '#fef3c7', label: 'Bright' },
  calm: { Icon: Coffee, color: '#4f5c42', bg: '#eae3d6', label: 'Calm' },
};

export default function MomentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [momentData, setMomentData] = useState<any>(null);
  const [taskCompleted, setTaskCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      
      const momentId = parseInt(id as string, 10);
      
      const rows = await db
        .select({
          id: moment.id,
          content: moment.content,
          createdAt: moment.createdAt,
          journalTitle: journal.title,
          emotion: moment.emotion,
          title: moment.title,
          mediaUri: moment.mediaUri,
          mediaType: moment.mediaType,
        })
        .from(moment)
        .leftJoin(journal, eq(moment.journalId, journal.id))
        .where(eq(moment.id, momentId))
        .limit(1);

      if (rows.length > 0) {
        const item = rows[0];
        setMomentData(item);
        
        // Load Task info
        const dateObj = parseSQLiteDate(item.createdAt);
        const sqlDateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
        
        const tasks = await db.select().from(dailyTask).where(eq(dailyTask.dateStr, sqlDateStr)).limit(1);
        if (tasks.length > 0) {
          setTaskCompleted(tasks[0].isCompleted);
        }
      }
    }
    
    loadData();
  }, [id]);

  if (!momentData) {
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

  const emotionConfig = (momentData.emotion && EMOTION_ICON_MAP[momentData.emotion]) || {
    Icon: Sparkle,
    color: '#566434',
    bg: '#eef1e4',
    label: 'Moment',
  };
  const EmotionIcon = emotionConfig.Icon;
  const displayTitle = momentData.title || momentData.journalTitle;
  const timeStr = formatTime(momentData.createdAt);
  const dateObj = parseSQLiteDate(momentData.createdAt);
  const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

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
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.metaHeader}>
          <Text style={styles.dateText}>{dateStr} at {timeStr}</Text>
          
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

        {displayTitle && (
          <Text style={styles.title}>{displayTitle}</Text>
        )}

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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0eee9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e4e2dd',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 10,
  },
  metaHeader: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
  },
  metaRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '600',
    color: '#8c7c6c',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#efe9e1',
  },
  taskText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '600',
  },
  emotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emotionText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontFamily: 'Playfair Display',
    fontSize: 32,
    fontWeight: '700',
    color: '#27170c',
    marginBottom: 20,
    lineHeight: 38,
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1c1a17',
    marginBottom: 24,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    lineHeight: 28,
    color: '#4f453f',
  }
});
