export const getCurrentWeekDates = () => {
  const today = new Date();
  const day = today.getDay();
  // Get the start of the week (Sunday)
  const diff = today.getDate() - day;
  const startOfWeek = new Date(today.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(startOfWeek);
    nextDay.setDate(startOfWeek.getDate() + i);
    dates.push(nextDay);
  }
  return dates;
};

export const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const formatDateForSQLite = (date: Date) => {
  // Returns YYYY-MM-DD
  return date.toISOString().split('T')[0];
};

export const formatSQLiteDate = (sqliteDateStr: string) => {
  return new Date(sqliteDateStr);
};

export const formatTime = (sqliteDateStr: string) => {
  const date = new Date(sqliteDateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
