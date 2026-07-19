import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { calculateStreak } from "../utils/dateUtils";

interface TopAppBarProps {
  moments?: Array<{ createdAt: string }>;
}

export function TopAppBar({ moments = [] }: TopAppBarProps) {
  const streak = calculateStreak(moments);
  const hour = new Date().getHours();
  
  let greeting = "Good Evening";
  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  return (
    <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
      <View>
        <Text className="font-jakarta text-[13px] font-medium text-onSurfaceVariant/70">
          Welcome back
        </Text>
        <Text className="font-jakarta text-[20px] font-bold text-primary -mt-0.5">
          {greeting}, Sarah
        </Text>
      </View>

      <View className="flex-row items-center gap-4">
        {/* Streak indicator */}
        <View className="flex-row items-center gap-1 bg-surfaceContainer px-3 py-1.5 rounded-full border border-outlineVariant/20">
          <MaterialIcons
            name="local-fire-department"
            size={18}
            color={streak > 0 ? "#E67E22" : "#8c7c6c"}
          />
          <Text className={`font-jakarta text-[13px] font-bold ${streak > 0 ? "text-terracotta" : "text-onSurfaceVariant"}`}>
            {streak}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="h-10 w-10 items-center justify-center rounded-full border border-outlineVariant bg-surfaceContainerLowest shadow-sm"
        >
          <Feather
            name="user"
            size={18}
            color="#4f453f"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}