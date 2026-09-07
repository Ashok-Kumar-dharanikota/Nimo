import { useEffect } from 'react';

export function useAppUpdates() {
  useEffect(() => {
    async function checkForUpdates() {
      // expo-updates is only supported in non-development standalone/production builds
      if (__DEV__) {
        return;
      }

      try {
        // Dynamic require to prevent crash when native module ExpoUpdates is absent (e.g. Expo Go)
        const Updates = require('expo-updates');

        if (!Updates || !Updates.isEnabled) {
          return;
        }

        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        // Safely ignore if native module ExpoUpdates is missing in current environment
        console.log('expo-updates not available in current environment:', error);
      }
    }

    checkForUpdates();
  }, []);
}
