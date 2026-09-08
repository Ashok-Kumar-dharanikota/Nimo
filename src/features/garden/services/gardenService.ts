import {
  GARDEN_THEMES,
  getSavedTheme,
  saveTheme,
  getTheme,
  type GardenThemeId,
  type GardenTheme,
} from '../utils/gardenThemes';
import { homeService } from '@/features/home/services/homeService';

class GardenService {
  /**
   * Retrieves the user's active garden theme.
   */
  public getTheme(): GardenTheme {
    const id = getSavedTheme();
    return getTheme(id);
  }

  /**
   * Saves a new garden theme preference.
   */
  public setTheme(themeId: GardenThemeId): void {
    saveTheme(themeId);
  }

  /**
   * Lists all available aesthetic themes.
   */
  public listThemes(): GardenTheme[] {
    return GARDEN_THEMES;
  }

  /**
   * Fetches the procedural year-to-date memory growth data.
   */
  public async getGardenDays() {
    return homeService.getMomentsForCurrentYear();
  }
}

export const gardenService = new GardenService();
