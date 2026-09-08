// Components
export { GardenScreenView } from './components/GardenScreenView';
export { ThemeSelectionModal } from './components/ThemeSelectionModal';

// Hooks
export { useGarden } from './hooks/useGarden';

// Services
export { gardenService } from './services/gardenService';

// Utils
export {
  GARDEN_THEMES,
  getSavedTheme,
  getTheme,
  saveTheme,
  getGrowthStage,
  getPlantVisual,
  calculateGardenStats,
  type GardenThemeId,
  type GardenTheme,
  type GrowthStage,
  type PlantType,
  type PlantVisual,
  type GardenStats,
} from './utils/gardenThemes';
