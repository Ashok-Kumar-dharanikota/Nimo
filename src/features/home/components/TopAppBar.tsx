import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export function TopAppBar() {
  return (
    <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
      <Text className="font-jakarta text-[14px] font-semibold text-onSurfaceVariant">
        Good Morning, Sarah
      </Text>

      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center gap-1 opacity-50">
          <MaterialIcons
            name="local-fire-department"
            size={20}
            color="#4f453f"
          />

          <Text className="font-jakarta text-[14px] font-bold text-onSurfaceVariant">
            0
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="h-10 w-10 items-center justify-center rounded-full border border-outlineVariant"
        >
          <Feather
            name="bell"
            size={18}
            color="#4f453f"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}