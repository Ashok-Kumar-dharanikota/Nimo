import { homeService } from '@/features/home/services/homeService';

class CalendarService {
  /**
   * Retrieves moments for calendar dates.
   */
  public async getMomentsForDate(date: Date) {
    return homeService.getTodaysFlow(date);
  }
}

export const calendarService = new CalendarService();
