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
  // Returns local YYYY-MM-DD
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const parseSQLiteDate = (sqliteDateStr: string): Date => {
  if (!sqliteDateStr) return new Date();
  if (sqliteDateStr.endsWith('Z') || sqliteDateStr.includes('T')) {
    return new Date(sqliteDateStr);
  }
  // Convert "YYYY-MM-DD HH:mm:ss" UTC string to ISO format "YYYY-MM-DDTHH:mm:ssZ"
  return new Date(sqliteDateStr.replace(' ', 'T') + 'Z');
};

export const formatSQLiteDate = (sqliteDateStr: string) => {
  return parseSQLiteDate(sqliteDateStr);
};

export const formatTime = (sqliteDateStr: string) => {
  const date = parseSQLiteDate(sqliteDateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const calculateStreak = (moments: Array<{ createdAt: string }>) => {
  if (!moments || moments.length === 0) return 0;
  
  // Get unique date strings (YYYY-MM-DD)
  const uniqueDates = new Set(
    moments.map(m => {
      const utcDate = new Date(m.createdAt.replace(' ', 'T') + 'Z');
      return formatDateForSQLite(utcDate);
    })
  );
  
  const todayStr = formatDateForSQLite(new Date());
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateForSQLite(yesterday);
  
  // If neither today nor yesterday has an entry, streak is 0
  if (!uniqueDates.has(todayStr) && !uniqueDates.has(yesterdayStr)) {
    return 0;
  }
  
  let streak = 0;
  const checkDate = new Date();
  
  // If today doesn't have an entry but yesterday does, start counting from yesterday
  if (!uniqueDates.has(todayStr) && uniqueDates.has(yesterdayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }
  
  while (true) {
    const dateStr = formatDateForSQLite(checkDate);
    if (uniqueDates.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

