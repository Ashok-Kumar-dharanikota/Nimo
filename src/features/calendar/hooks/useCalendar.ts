import { useState } from 'react';

export function useCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return {
    selectedDate,
    setSelectedDate,
  };
}
