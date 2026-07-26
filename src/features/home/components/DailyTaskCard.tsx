import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { CheckCircle, Circle, Edit3, Heart, Plus, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTaskData } from '@/features/home/hooks/useTaskData';
import { draftStore } from '@/store/draftStore';

const DEFAULT_TASKS = [
  'Disconnect for an hour',
  'Take a 15-minute mindful walk',
  'Write three things you are grateful for',
  'Reach out to an old friend',
  'Spend 10 minutes in silence',
  'Do a random act of kindness',
];

export function DailyTaskCard({ isAddingTask, onCancelAdd, onTaskSet }: { isAddingTask: boolean, onCancelAdd: () => void, onTaskSet: () => void }) {
  const { todayTask, isLoading, setTodayTask, completeTask } = useTaskData();
  const [customTask, setCustomTask] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If there's no task and we're not explicitly adding one, hide it.
  if (!todayTask && !isAddingTask) return null;

  const handleSelectTask = async (title: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSubmitting(true);
    try {
      await setTodayTask(title);
      // Once set, we trigger onTaskSet which handles closing selector and optionally starting draft
      onTaskSet();
    } catch (e) {
      console.error(e);
    }
    setIsSubmitting(false);
  };

  const handleComplete = async () => {
    if (!todayTask) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await completeTask({ id: todayTask.id, title: todayTask.title });
  };

  const isCompleted = todayTask?.isCompleted;

  if (todayTask) {
    return (
      <Animated.View entering={FadeInDown.duration(350)} exiting={FadeOutUp.duration(250)} style={styles.timelineRow}>
        <View style={styles.threadNodeCol}>
          <View style={[styles.threadDot, isCompleted ? styles.completedDot : null]}>
            {isCompleted ? <CheckCircle size={14} color="#566434" /> : <Sparkles size={14} color="#b5651d" />}
          </View>
        </View>

        <View style={styles.cardContentCol}>
          <Text style={styles.timestampText}>Daily Task</Text>

          <TouchableOpacity
            activeOpacity={isCompleted ? 1 : 0.7}
            onPress={isCompleted ? undefined : handleComplete}
            style={[styles.cardContainer, isCompleted ? styles.completedCard : null]}
          >
            <View style={styles.taskRow}>
              <View style={styles.checkCircle}>
                {isCompleted ? <CheckCircle size={24} color="#566434" /> : <Circle size={24} color="#b5651d" />}
              </View>
              <Text style={[styles.taskTitle, isCompleted ? styles.completedTaskTitle : null]}>
                {todayTask.title}
              </Text>
            </View>
            {!isCompleted && (
              <Text style={styles.taskSubtitle}>
                Tap to complete and plant as a moment.
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(350)} exiting={FadeOutUp.duration(250)} style={styles.timelineRow}>
      <View style={styles.threadNodeCol}>
        <View style={styles.threadDot}>
          <Edit3 size={14} color="#566434" />
        </View>
      </View>

      <View style={styles.cardContentCol}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
           <Text style={styles.timestampText}>Choose Today's Task</Text>
           <TouchableOpacity onPress={onCancelAdd}><Text style={{fontSize:11, color:'#a89a8b'}}>Cancel</Text></TouchableOpacity>
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.selectorSubtitle}>Set a tiny task to unlock your garden today.</Text>
          
          <View style={styles.tasksList}>
            {DEFAULT_TASKS.map((t) => (
              <TouchableOpacity key={t} activeOpacity={0.7} onPress={() => handleSelectTask(t)} style={styles.taskOptionBtn}>
                <Text style={styles.taskOptionText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.customTaskRow}>
            <TextInput
              style={styles.customTaskInput}
              placeholder="Or write your own..."
              placeholderTextColor="#a89a8b"
              value={customTask}
              onChangeText={setCustomTask}
            />
            <TouchableOpacity 
              disabled={!customTask.trim() || isSubmitting} 
              onPress={() => handleSelectTask(customTask.trim())}
              style={[styles.customTaskSubmit, !customTask.trim() ? { opacity: 0.5 } : null]}
            >
              <Plus size={16} color="white" />
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#f7ede2',
    borderWidth: 2,
    borderColor: '#e8cdb3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedDot: {
    backgroundColor: '#eef1e4',
    borderColor: '#c7d2ab',
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
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#e8cdb3',
    borderStyle: 'dashed',
  },
  completedCard: {
    borderColor: '#c7d2ab',
    backgroundColor: '#fcfbf7',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 15,
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '600',
    color: '#27170c',
    flex: 1,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#8c7c6c',
  },
  taskSubtitle: {
    fontSize: 12,
    color: '#b5651d',
    fontFamily: 'Plus Jakarta Sans',
    marginTop: 8,
    marginLeft: 36,
  },
  selectorSubtitle: {
    fontSize: 13,
    color: '#6b5d51',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: 12,
  },
  tasksList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  taskOptionBtn: {
    backgroundColor: '#f7ede2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0e0cc',
  },
  taskOptionText: {
    fontSize: 12,
    color: '#b5651d',
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '600',
  },
  customTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customTaskInput: {
    flex: 1,
    backgroundColor: '#fbf9f4',
    borderWidth: 1,
    borderColor: '#efe9e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: 'Plus Jakarta Sans',
  },
  customTaskSubmit: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#b5651d',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
