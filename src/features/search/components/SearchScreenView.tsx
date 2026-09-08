import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FlashList } from '@shopify/flash-list';
import { Search } from 'lucide-react-native';
import { Skeleton } from '@/components/ui/skeleton';

import { useSearchMoments } from '../hooks/useSearchMoments';
import { SearchHeader } from './SearchHeader';
import { SearchMomentCard } from './SearchMomentCard';
import type { SearchMomentItem } from '../utils/searchConstants';

export function SearchScreenView() {
  const {
    searchQuery,
    setSearchQuery,
    filteredMoments,
    isLoading,
  } = useSearchMoments();

  return (
    <SafeAreaView className="flex-1 bg-[#fbf9f4]">
      <StatusBar style="dark" />

      {/* Search Header */}
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />

      {/* Loading Skeletons */}
      {isLoading ? (
        <View className="flex-1 px-3 pt-2">
          <View className="flex-row flex-wrap justify-between">
            {[1, 2, 3, 4].map((i) => (
              <View key={i} className="w-[48%] p-1.5 mb-2">
                <View className="bg-white rounded-[20px] p-3 border border-[#efe9e1] shadow-sm">
                  <Skeleton className="w-full aspect-square rounded-[14px] mb-2.5 bg-[#f0eee9]" />
                  <Skeleton className="w-16 h-4 rounded-full mb-2 bg-[#f0eee9]" />
                  <Skeleton className="w-3/4 h-4 rounded mb-1 bg-[#f0eee9]" />
                  <Skeleton className="w-full h-3 rounded mb-1 bg-[#f0eee9]" />
                  <Skeleton className="w-5/6 h-3 rounded bg-[#f0eee9]" />
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : (
        /* 2-Column Masonry List with FlashList */
        <View className="flex-1 px-3 pt-2">
          <FlashList
            data={filteredMoments}
            renderItem={({ item }: { item: SearchMomentItem }) => (
              <SearchMomentCard item={item} />
            )}
            keyExtractor={(item: SearchMomentItem) => `search-moment-${item.id}`}
            numColumns={2}
            masonry={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={
              <View className="items-center justify-center py-16 px-6">
                <View className="w-16 h-16 rounded-full bg-[#f0eee9] items-center justify-center mb-3">
                  <Search size={28} color="#a89a8b" />
                </View>
                <Text className="font-playfair text-[18px] font-bold text-[#27170c] text-center mb-1">
                  {searchQuery ? 'No matching moments found' : 'No moments saved yet'}
                </Text>
                <Text className="font-jakarta text-[13px] text-[#8c7c6c] text-center">
                  {searchQuery
                    ? 'Try searching for different keywords or emotions.'
                    : 'Start capturing your daily reflections to see them here.'}
                </Text>
              </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}
