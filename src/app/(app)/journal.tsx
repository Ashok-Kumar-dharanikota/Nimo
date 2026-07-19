import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function Journal() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* TopAppBar */}
      <View className="flex-row justify-between items-center w-full px-5 py-4 border-b border-surfaceVariant bg-surface/80">
        <View className="flex-row items-center">
          <Text className="font-jakarta text-2xl font-bold text-primary">My Journals</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center bg-surfaceContainer">
            <MaterialIcons name="search" size={24} color="#4f453f" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full overflow-hidden border border-surfaceVariant">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop' }} 
              className="w-full h-full"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        {/* Bento Grid Layout */}
        <View className="flex-row flex-wrap justify-between">
          
          {/* Item 1: Full Width */}
          <TouchableOpacity className="w-full aspect-[4/3] rounded-3xl overflow-hidden mb-4 shadow-md bg-primary">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1506744626753-1fa44df31c7f?q=80&w=600&auto=format&fit=crop' }}
              className="w-full h-full absolute"
            />
            <View className="absolute inset-0 bg-black/40" />
            <View className="absolute bottom-0 left-0 w-full p-6 pb-8 flex-col justify-end">
              <View className="flex-row items-center gap-2 mb-3">
                <View className="flex-row items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <MaterialIcons name="sentiment-satisfied" size={14} color="#A4B47C" />
                  <Text className="font-jakarta text-xs text-white font-medium">Oct 23</Text>
                </View>
                <View className="flex-row items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <MaterialIcons name="photo-camera" size={14} color="white" />
                  <Text className="font-jakarta text-xs text-white font-medium">4 items</Text>
                </View>
              </View>
              <Text className="font-jakarta text-3xl font-bold text-white mb-2">A surprisingly quiet morning</Text>
              <Text className="font-jakarta text-base text-white/80" numberOfLines={2}>
                Woke up before the sun. The house was completely silent, allowing me to gather my thoughts and just breathe...
              </Text>
            </View>
          </TouchableOpacity>

          {/* Half Width Items */}
          <View className="flex-row justify-between w-full mb-4">
            {/* Item 2 */}
            <TouchableOpacity className="w-[48%] aspect-square rounded-3xl overflow-hidden shadow-sm bg-primary">
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1466692476877-3e1b764b8577?q=80&w=600&auto=format&fit=crop' }}
                className="w-full h-full absolute"
              />
              <View className="absolute inset-0 bg-black/40" />
              <View className="absolute bottom-0 left-0 w-full p-4 flex-col justify-end">
                <Text className="font-jakarta text-xs text-white/90 mb-2">Oct 22</Text>
                <Text className="font-jakarta text-lg font-semibold text-white" numberOfLines={2}>
                  Finding focus in the garden
                </Text>
              </View>
            </TouchableOpacity>

            {/* Item 3 */}
            <TouchableOpacity className="w-[48%] aspect-square rounded-3xl overflow-hidden shadow-sm bg-primary">
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=600&auto=format&fit=crop' }}
                className="w-full h-full absolute"
              />
              <View className="absolute inset-0 bg-black/40" />
              <View className="absolute bottom-0 left-0 w-full p-4 flex-col justify-end">
                <Text className="font-jakarta text-xs text-white/90 mb-2">Oct 20</Text>
                <Text className="font-jakarta text-lg font-semibold text-white" numberOfLines={2}>
                  Processing the meeting notes
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Item 4: Quote text only */}
          <TouchableOpacity className="w-[48%] aspect-square rounded-3xl bg-secondary/20 p-5 flex-col justify-between shadow-sm mb-4">
            <View className="flex-row justify-between items-start">
              <View className="w-10 h-10 rounded-full bg-secondary items-center justify-center">
                <MaterialIcons name="format-quote" size={20} color="white" />
              </View>
              <Text className="font-jakarta text-xs text-onSecondaryContainer/80">Oct 18</Text>
            </View>
            <Text className="font-jakarta text-base text-onSecondaryContainer italic" numberOfLines={4}>
              "Growth is not about pushing harder, but about finding the right environment to bloom naturally."
            </Text>
          </TouchableOpacity>

        </View>
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
