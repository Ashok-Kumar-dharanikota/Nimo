import React, { useMemo } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Check } from "lucide-react-native";
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

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function WeeklyStreaksComponent({ moments }: WeeklyStreaksProps) {
  const weekDates = useMemo(() => getCurrentWeekDates(), []);
  const today = useMemo(() => new Date(), []);

  const completedDateStrings = useMemo(() => {
    const set = new Set<string>();
    for (const moment of moments) {
      if (moment.createdAt) {
        const d = formatSQLiteDate(moment.createdAt);
        set.add(
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        );
      }
    }
    return set;
  }, [moments]);

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(100)}
      className="flex-row justify-between px-5 mt-2 mb-6 bg-surfaceContainerLow/50 py-4.5 rounded-[24px] border border-outlineVariant/10"
    >
      {weekDates.map((date, index) => {
        const isToday = isSameDay(date, today);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const completed = completedDateStrings.has(dateStr);

        const dayStyle = completed
          ? "text-secondary font-bold"
          : isToday
            ? "text-primary font-bold"
            : "text-onSurfaceVariant/60";

        const dateStyle = completed
          ? "text-secondary font-bold"
          : isToday
            ? "text-primary font-bold"
            : "text-onSurfaceVariant/60";

        const circleStyle = completed
          ? "border-secondary bg-secondary/15"
          : isToday
            ? "border-[2px] border-primary bg-surfaceContainerLowest"
            : "border border-dashed border-outlineVariant bg-surfaceContainerLowest opacity-60";

        return (
          <View
            key={date.toISOString()}
            className="items-center gap-2 flex-1"
          >
            <Text
              className={`text-[10px] font-semibold tracking-wide ${dayStyle}`}
            >
              {DAYS[index]}
            </Text>

            <View
              className={`w-9 h-9 rounded-full items-center justify-center border ${circleStyle}`}
            >
              {completed ? (
                <Check size={16} />
              ) : isToday ? (
                <View className="w-2.5 h-2.5 rounded-full bg-primary" />
              ) : (
                <Text className="text-[10px] text-onSurfaceVariant/40 font-bold">{date.getDate()}</Text>
              )}
            </View>

            <Text
              className={`text-[9px] font-semibold ${dateStyle}`}
            >
              {completed ? "" : isToday ? "Today" : ""}
            </Text>
          </View>
        );
      })}
    </Animated.View>
  );
}

export const WeeklyStreaks = React.memo(WeeklyStreaksComponent);