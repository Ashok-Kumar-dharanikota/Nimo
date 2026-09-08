import React, { useMemo } from "react";
import { Flame } from "lucide-react-native";
import { Text, View } from "react-native";
import { calculateStreak } from "../utils/dateUtils";
import { useProfileStore } from "@/features/profile/hooks/useProfileStore";
import { SyncIndicator } from "./SyncIndicator";

interface TopAppBarProps {
  moments?: Array<{ createdAt: string }>;
}

function TopAppBarComponent({ moments = [] }: TopAppBarProps) {
  const { profile } = useProfileStore();
  const streak = useMemo(() => calculateStreak(moments), [moments]);
  const hour = new Date().getHours();

  let greeting = "Good Evening";
  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  const firstName = profile.name ? profile.name.trim().split(" ")[0] : "there";

  return (
    <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
      <View>
        <Text className="font-jakarta text-[13px] font-medium text-onSurfaceVariant/70">
          Welcome back
        </Text>
        <Text className="font-jakarta text-[20px] font-bold text-primary -mt-0.5">
          {greeting}, {firstName}
        </Text>
      </View>

      <View className="flex-row items-center gap-3">
        {/* Streak indicator */}
        <View className="flex-row items-center gap-1 bg-surfaceContainer px-3 py-1.5 rounded-full border border-outlineVariant/20">
          <Flame
            size={18}
            color={streak > 0 ? "#E67E22" : "#8c7c6c"}
          />
          <Text className={`font-jakarta text-[13px] font-bold ${streak > 0 ? "text-terracotta" : "text-onSurfaceVariant"}`}>
            {streak}
          </Text>
        </View>

        <SyncIndicator />
      </View>
    </View>
  );
}

export const TopAppBar = React.memo(TopAppBarComponent);