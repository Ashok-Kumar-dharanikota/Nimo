export type JournalEntry = {
  id: string;
  text: string;
  mood: string;
  location?: string;
  date: string;
};

let entries: JournalEntry[] = [
  { id: '1', text: 'Morning coffee and reading a great book.', mood: 'sun.max.fill', location: 'Home', date: new Date().toISOString() },
  { id: '2', text: 'Had a productive meeting today. Feeling accomplished!', mood: 'star.fill', location: 'Office', date: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', text: 'A short walk in the park. The weather was beautiful.', mood: 'leaf.fill', location: 'Park', date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: '4', text: 'Feeling a bit tired today. Need to catch up on sleep.', mood: 'moon.zzz.fill', location: 'Home', date: new Date(Date.now() - 86400000 * 3).toISOString() },
];

let listeners: Array<() => void> = [];

export const journalStore = {
  getSnapshot: () => entries,
  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  addEntry: (entry: { text: string; mood: string; location?: string }) => {
    entries = [{ id: Math.random().toString(), date: new Date().toISOString(), ...entry }, ...entries];
    listeners.forEach(l => l());
  }
};
