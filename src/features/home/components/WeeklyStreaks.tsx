import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import {
  formatSQLiteDate,
  getCurrentWeekDates,
  isSameDay,
} from "../utils/dateUtils";

type Moment = {
  createdAt: string;
};

interface WeeklyStreaksProps {
  moments: Moment[];
}

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function WeeklyStreaks({ moments }: WeeklyStreaksProps) {
  const weekDates = getCurrentWeekDates();
  const today = new Date();

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(100)}
      className="flex-row justify-between px-5 mt-2 mb-6"
    >
      {weekDates.map((date, index) => {
        const isToday = isSameDay(date, today);

        const completed = moments.some((moment) =>
          isSameDay(formatSQLiteDate(moment.createdAt), date)
        );

        const dayStyle = completed
          ? "text-sage"
          : isToday
            ? "text-primary font-bold"
            : "text-onSurfaceVariant/60";

        const dateStyle = completed
          ? "text-sage"
          : isToday
            ? "text-primary font-bold"
            : "text-onSurfaceVariant/60";

        const circleStyle = completed
          ? "border-sage bg-sage"
          : isToday
            ? "border-[1.5px] border-primary bg-surfaceContainerLowest"
            : "border border-dashed border-outlineVariant bg-surfaceContainerLowest opacity-50";

        return (
          <View
            key={date.toISOString()}
            className="items-center gap-2"
          >
            <Text
              className={`text-[10px] uppercase font-medium ${dayStyle}`}
            >
              {DAYS[index]}
            </Text>

            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${circleStyle}`}
            >
              {completed && (
                <Feather
                  name="check"
                  size={16}
                  color="white"
                />
              )}
            </View>

            <Text
              className={`text-[10px] font-medium ${dateStyle}`}
            >
              {date.getDate()}
            </Text>
          </View>
        );
      })}
    </Animated.View>
  );
}