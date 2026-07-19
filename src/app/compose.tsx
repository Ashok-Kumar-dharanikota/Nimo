import { useState } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SymbolView } from 'expo-symbols';
import { useColorScheme } from 'react-native';

import { journalStore } from '@/store/journal';
import { Colors } from '@/constants/theme';

const MOODS = [
  { id: 'sun.max.fill', label: 'Happy' },
  { id: 'star.fill', label: 'Excited' },
  { id: 'leaf.fill', label: 'Calm' },
  { id: 'moon.zzz.fill', label: 'Tired' },
  { id: 'cloud.rain.fill', label: 'Sad' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function MoodPill({ item, isSelected, onPress, theme }: { item: any, isSelected: boolean, onPress: () => void, theme: any }) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isSelected ? 1.1 : 1) }],
      backgroundColor: withSpring(isSelected ? theme.text : theme.backgroundElement),
    };
  });

  return (
    <AnimatedPressable
      style={[styles.moodPill, animatedStyle]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
    >
      <SymbolView name={item.id as any} size={20} tintColor={isSelected ? theme.background : theme.textSecondary} />
      {isSelected && (
        <Text style={[styles.moodLabel, { color: theme.background }]}>{item.label}</Text>
      )}
    </AnimatedPressable>
  );
}

export default function ComposeScreen() {
  const [text, setText] = useState('');
  const [selectedMood, setSelectedMood] = useState(MOODS[0].id);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const handleSave = async () => {
    if (!text.trim()) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    journalStore.addEntry({
      text: text.trim(),
      mood: selectedMood,
      location: 'Current Location', // mock
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={20}>
          <SymbolView name="xmark" size={24} tintColor={theme.text} />
        </Pressable>
        <Pressable onPress={handleSave} style={[styles.saveButton, { backgroundColor: theme.text, opacity: text.trim() ? 1 : 0.5 }]} disabled={!text.trim()}>
          <Text style={[styles.saveButtonText, { color: theme.background }]}>Save</Text>
        </Pressable>
      </View>

      <View style={styles.moodSelectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodSelector}>
          {MOODS.map(mood => (
            <MoodPill 
              key={mood.id} 
              item={mood} 
              isSelected={selectedMood === mood.id} 
              onPress={() => setSelectedMood(mood.id)} 
              theme={theme}
            />
          ))}
        </ScrollView>
      </View>

      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder="What's on your mind?"
        placeholderTextColor={theme.textSecondary}
        multiline
        autoFocus
        value={text}
        onChangeText={setText}
        textAlignVertical="top"
      />

      <View style={[styles.accessoryBar, { backgroundColor: theme.backgroundElement, borderTopColor: theme.backgroundSelected }]}>
        <Pressable style={styles.accessoryButton}>
          <SymbolView name="camera.fill" size={20} tintColor={theme.textSecondary} />
        </Pressable>
        <Pressable style={styles.accessoryButton}>
          <SymbolView name="mappin.and.ellipse" size={20} tintColor={theme.textSecondary} />
        </Pressable>
        <Pressable style={styles.accessoryButton}>
          <SymbolView name="mic.fill" size={20} tintColor={theme.textSecondary} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    fontWeight: 'bold',
  },
  moodSelectorContainer: {
    paddingVertical: 10,
  },
  moodSelector: {
    paddingHorizontal: 20,
    gap: 12,
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  moodLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    flex: 1,
    fontSize: 20,
    lineHeight: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  accessoryBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 20,
  },
  accessoryButton: {
    padding: 8,
  },
});
