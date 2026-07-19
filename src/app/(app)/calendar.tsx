import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function Calendar() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const renderDay = (day: number | null, hasEntry: boolean = false) => {
    if (!day) return <View className="w-[12%] aspect-square" />;
    
    return (
      <TouchableOpacity 
        key={day}
        onPress={() => hasEntry ? setSelectedDay(day) : null}
        className={`w-[13%] aspect-square rounded-full items-center justify-center m-[1%] ${
          hasEntry 
            ? 'bg-secondary/20 shadow-sm' 
            : 'border border-surfaceContainerHighest'
        }`}
      >
        <Text className={`font-jakarta text-base ${hasEntry ? 'font-semibold text-secondary' : 'text-onSurface'}`}>
          {day}
        </Text>
        {hasEntry && <View className="w-1 h-1 rounded-full bg-terracotta mt-1" />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      {/* TopAppBar */}
      <View className="flex-row justify-between items-center w-full px-5 py-4 bg-canvas z-40">
        <TouchableOpacity className="p-2 -ml-2 rounded-full text-chocolate">
          <MaterialIcons name="menu" size={24} color="#3E2B1F" />
        </TouchableOpacity>
        <Text className="font-jakarta text-xl font-bold text-chocolate">Serene Journal</Text>
        <TouchableOpacity className="w-10 h-10 rounded-full overflow-hidden bg-surfaceContainerHigh">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop' }} 
            className="w-full h-full"
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="font-jakarta text-3xl font-bold text-chocolate mb-2">Your Timeline</Text>
          <Text className="font-jakarta text-base text-onSurfaceVariant">Reflect on your journey, one day at a time.</Text>
        </View>

        {/* Month Section */}
        <View className="mb-10">
          <View className="sticky top-0 z-30 bg-canvas/90 py-4 mb-4">
            <Text className="font-jakarta text-xl font-bold text-chocolate">October 2026</Text>
          </View>
          
          {/* Day Labels */}
          <View className="flex-row flex-wrap mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <Text key={i} className="w-[14%] text-center font-jakarta text-xs text-outline font-medium">{d}</Text>
            ))}
          </View>
          
          {/* Calendar Grid */}
          <View className="flex-row flex-wrap">
            {/* Empty padding for Oct 1st starting on Thursday */}
            {renderDay(null)}
            {renderDay(null)}
            {renderDay(null)}
            {renderDay(null)}
            
            {/* Days */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
              renderDay(day, [3, 10, 15, 20, 22, 23].includes(day))
            ))}
          </View>
        </View>
        <View className="h-20" />
      </ScrollView>

      {/* Immersive Day Flip Overlay (Modal) */}
      <Modal
        visible={selectedDay !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedDay(null)}
      >
        <View className="flex-1 bg-canvas/80 justify-center items-center p-5">
          <TouchableOpacity 
            className="absolute inset-0"
            onPress={() => setSelectedDay(null)}
          />
          
          <View className="bg-surfaceContainerLowest w-full h-[80%] rounded-3xl overflow-hidden shadow-lg">
            {/* Header Image */}
            <View className="h-[40%] w-full relative">
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1506744626753-1fa44df31c7f?q=80&w=600&auto=format&fit=crop' }}
                className="w-full h-full"
              />
              <TouchableOpacity 
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 items-center justify-center"
                onPress={() => setSelectedDay(null)}
              >
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
              
              <View className="absolute bottom-4 left-4 flex-row items-end gap-3">
                <Text className="font-jakarta text-6xl font-bold text-white tracking-tighter">
                  {selectedDay}
                </Text>
                <View className="mb-2">
                  <Text className="font-jakarta text-base text-white/90">Oct</Text>
                  <Text className="font-jakarta text-xs text-white/70">2026</Text>
                </View>
              </View>
            </View>

            {/* Content */}
            <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
              <View className="flex-row items-center gap-2 mb-4">
                <MaterialIcons name="sentiment-satisfied" size={20} color="#A4B47C" />
                <Text className="font-jakarta text-sm text-sage font-medium">Peaceful</Text>
              </View>
              
              <Text className="font-jakarta text-2xl font-bold text-primary mb-4">A surprisingly quiet morning</Text>
              
              <Text className="font-jakarta text-base text-onSurfaceVariant leading-relaxed">
                Woke up before the sun. The house was completely silent, allowing me to gather my thoughts and just breathe before the day started. The mist over the lake was absolutely breathtaking today.
                {'\n\n'}
                I sat on the porch with my coffee for nearly an hour. No phone, no music, just the sound of the birds waking up. It's rare to find this kind of stillness, and I want to remember how restorative it feels.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
