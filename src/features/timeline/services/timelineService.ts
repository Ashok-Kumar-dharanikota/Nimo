import { homeService } from '@/features/home/services/homeService';

class TimelineService {
  /**
   * Retrieves chronological flow of moments for a specific day.
   */
  public async getMomentsForDate(targetDate: Date) {
    return homeService.getTodaysFlow(targetDate);
  }
}

export const timelineService = new TimelineService();
