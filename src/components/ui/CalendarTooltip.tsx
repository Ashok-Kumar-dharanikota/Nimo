import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import * as Haptics from 'expo-haptics';

interface CalendarTooltipProps {
  children: React.ReactNode;
}

export function CalendarTooltip({ children }: CalendarTooltipProps) {
  const triggerRef = React.useRef<React.ElementRef<typeof TooltipTrigger>>(null);

  // Generate a simple calendar grid for the current month
  const calendarData = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    return {
      monthName: today.toLocaleString('default', { month: 'long' }),
      year,
      weeks,
      currentDay: today.getDate()
    };
  }, []);

  const handleDayPress = (day: number | null) => {
    if (!day) return;
    Haptics.selectionAsync();
    triggerRef.current?.close();
  };

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild ref={triggerRef}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            triggerRef.current?.open();
          }}
        >
          {children}
        </TouchableOpacity>
      </TooltipTrigger>
      
      <TooltipContent side="bottom" sideOffset={8} className="bg-white rounded-xl shadow-lg border border-[#efe9e1] p-4 w-[280px]">
        <View className="mb-3">
          <Text className="font-playfair text-lg font-bold text-[#27170c] text-center">
            {calendarData.monthName} {calendarData.year}
          </Text>
        </View>
        
        <View className="flex-row justify-between mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <Text key={d} className="font-jakarta text-[11px] font-bold text-[#8c7c6c] w-8 text-center">
              {d}
            </Text>
          ))}
        </View>
        
        {calendarData.weeks.map((week, wIndex) => (
          <View key={wIndex} className="flex-row justify-between mb-2">
            {week.map((day, dIndex) => (
              <TouchableOpacity
                key={dIndex}
                disabled={!day}
                onPress={() => handleDayPress(day)}
                className={`w-8 h-8 items-center justify-center rounded-full ${
                  day === calendarData.currentDay ? 'bg-[#566434]' : ''
                }`}
              >
                <Text
                  className={`font-jakarta text-[13px] ${
                    !day
                      ? 'text-transparent'
                      : day === calendarData.currentDay
                      ? 'text-white font-bold'
                      : 'text-[#4f453f]'
                  }`}
                >
                  {day || ''}
                </Text>
              </TouchableOpacity>
            ))}
            {/* Fill empty spots if last week is short */}
            {week.length < 7 &&
              Array.from({ length: 7 - week.length }).map((_, i) => (
                <View key={`empty-${i}`} className="w-8 h-8" />
              ))}
          </View>
        ))}
      </TooltipContent>
    </Tooltip>
  );
}
