import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClear: () => void;
}

export function SearchHeader({
  searchQuery,
  onSearchChange,
  onClear,
}: SearchHeaderProps) {
  const router = useRouter();

  return (
    <View className="px-5 pt-3 pb-3 border-b border-[#efe9e1]">
      <View className="flex-row items-center gap-2 mb-3">
        {router.canGoBack() && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            className="w-9 h-9 rounded-full bg-[#f0eee9] items-center justify-center border border-[#e4e2dd]"
          >
            <ArrowLeft size={16} color="#4f453f" />
          </TouchableOpacity>
        )}
        <Text className="font-playfair text-[24px] font-bold text-[#27170c] flex-1">
          Search Moments
        </Text>
      </View>

      {/* Textbox search field input */}
      <View className="flex-row items-center bg-white rounded-[20px] border border-[#ece5db] px-3.5 py-2.5 shadow-sm">
        <Search size={18} color="#8c7c6c" className="mr-2" />
        <TextInput
          className="flex-1 font-jakarta text-[14px] text-[#27170c] p-0"
          placeholder="Search entries, titles, emotions…"
          placeholderTextColor="#b3a598"
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClear}
            className="p-1"
          >
            <X size={16} color="#8c7c6c" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
