import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { TopAppBar } from './TopAppBar';

interface EmptyHomeStateProps {
  onAddMoment: (content: string) => void;
  isAdding: boolean;
}

export const EmptyHomeState = ({ onAddMoment, isAdding }: EmptyHomeStateProps) => {
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (content.trim()) {
      onAddMoment(content.trim());
      setContent('');
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      <TopAppBar />
      
      <View className="px-5 md:px-12 mt-4 flex-col gap-8 mb-8">
        
        {/* Guided First Entry Card */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} className="bg-surfaceContainerLow rounded-[24px] p-6 md:p-8 border border-surfaceVariant relative overflow-hidden">
          {/* Soft blur overlay representing the gradient */}
          <View className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/10 rounded-full opacity-50" />
          
          <View className="relative z-10">
            <View className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-surfaceVariant">
              <MaterialIcons name="edit-note" size={24} color="#27170c" />
            </View>
            
            <Text className="font-jakarta text-[32px] leading-[40px] font-bold text-primary mb-2 tracking-tight">
              Welcome to your space.
            </Text>
            <Text className="font-jakarta text-[18px] leading-[28px] text-onSurfaceVariant mb-6">
              Let's start small. Take 60 seconds to set an intention or reflect on your morning.
            </Text>
            
            <View className="bg-surfaceContainerLowest rounded-[16px] p-4 border border-surfaceVariant shadow-sm focus-within:border-primary">
              <Text className="font-jakarta text-[14px] leading-[20px] font-semibold text-onSurfaceVariant mb-2">
                What's on your mind right now?
              </Text>
              
              <TextInput 
                className="w-full bg-transparent font-jakarta text-[16px] leading-[24px] text-onSurface mb-4 min-h-[72px]"
                placeholder="I am feeling..."
                placeholderTextColor="#d2c4bc"
                multiline
                textAlignVertical="top"
                value={content}
                onChangeText={setContent}
              />
              
              <View className="flex-row justify-between items-center pt-3 border-t border-surfaceContainer">
                <View className="flex-row gap-2 text-onSurfaceVariant/60">
                  <TouchableOpacity className="p-1">
                    <Feather name="smile" size={20} color="#71594b" />
                  </TouchableOpacity>
                  <TouchableOpacity className="p-1">
                    <Feather name="image" size={20} color="#71594b" />
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                  onPress={handleSave}
                  disabled={!content.trim() || isAdding}
                  className={`bg-primary px-4 py-2 rounded-full flex-row items-center gap-1 shadow-md ${!content.trim() || isAdding ? 'opacity-50' : 'opacity-100'}`}
                >
                  {isAdding ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Text className="font-jakarta text-[14px] leading-[20px] font-semibold text-white">Save Entry</Text>
                      <Feather name="arrow-right" size={18} color="white" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Timeline Placeholder */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} className="bg-surfaceContainerLowest p-6 md:p-8 rounded-[24px] border border-dashed border-outlineVariant/60 h-full relative overflow-hidden mb-10">
          <View className="absolute inset-0 bg-gradient-to-b from-transparent to-surfaceContainerLowest/90 z-10 pointer-events-none" />
          
          <View className="flex-row justify-between items-center mb-6 relative z-20">
            <Text className="font-jakarta text-[22px] leading-[30px] font-semibold text-primary opacity-60">Today's Flow</Text>
            <View className="bg-surfaceVariant px-2 py-1 rounded-full opacity-80">
              <Text className="font-jakarta text-[10px] font-bold uppercase tracking-widest text-onSurfaceVariant">Preview</Text>
            </View>
          </View>
          
          <Text className="font-jakarta text-[15px] leading-[22px] text-onSurfaceVariant mb-8 opacity-60 relative z-20">
            Your day will take shape here. Log moments as they happen.
          </Text>
          
          <View className="relative pl-6 flex-col gap-8 py-2 ml-2 opacity-50">
            {/* Dashed Line */}
            <View className="absolute left-[3px] top-4 bottom-0 w-[2px] border-l-2 border-dashed border-outlineVariant/40 h-full" />
            
            {/* Ghost Item 1 */}
            <View className="relative">
              <View className="absolute -left-[41px] top-0 w-8 h-8 rounded-full border-2 border-dashed border-outlineVariant/60 bg-surfaceContainerLowest flex items-center justify-center">
                <View className="w-2 h-2 rounded-full bg-outlineVariant/40" />
              </View>
              <View className="flex-col">
                <View className="w-16 h-3.5 bg-surfaceVariant/60 rounded mb-2" />
                <View className="w-3/4 h-4 bg-surfaceVariant/60 rounded mb-2" />
                <View className="w-full h-2.5 bg-surfaceVariant/60 rounded mb-1" />
                <View className="w-4/5 h-2.5 bg-surfaceVariant/60 rounded" />
              </View>
            </View>
            
            {/* Ghost Item 2 */}
            <View className="relative">
              <View className="absolute -left-[41px] top-0 w-8 h-8 rounded-full border-2 border-dashed border-outlineVariant/60 bg-surfaceContainerLowest flex items-center justify-center">
                <View className="w-2 h-2 rounded-full bg-outlineVariant/40" />
              </View>
              <View className="flex-col">
                <View className="w-16 h-3.5 bg-surfaceVariant/60 rounded mb-2" />
                <View className="w-2/3 h-4 bg-surfaceVariant/60 rounded mb-2" />
                <View className="w-full h-20 bg-surfaceVariant/60 rounded-lg mb-1" />
              </View>
            </View>
            
            {/* Active Add Button overlapping the ghost gradient */}
            <View className="relative mt-4 z-20 flex-row items-start pt-1 opacity-70">
              <View className="absolute -left-[41px] top-0 w-8 h-8 rounded-full border-2 border-dashed border-outlineVariant/80 bg-surfaceContainerLowest flex items-center justify-center shadow-sm">
                <Feather name="plus" size={18} color="#b3a59d" />
              </View>
              <View className="flex-col pt-[2px]">
                <Text className="font-jakarta text-[15px] leading-[22px] font-medium text-onSurfaceVariant/60">Add Your First Moment</Text>
                <Text className="font-jakarta text-[11px] leading-[14px] font-medium text-onSurfaceVariant/40 mt-0.5">Start building your timeline</Text>
              </View>
            </View>

          </View>
        </Animated.View>

      </View>
    </ScrollView>
  );
};
