import { initExecutorch } from 'react-native-executorch';
import { ExpoResourceFetcher } from 'react-native-executorch-expo-resource-fetcher';

/**
 * Initialize ExecuTorch with the Expo resource fetcher.
 * Call this once at app boot before any model loading.
 * No model is downloaded here — model loading is deferred to the Nimo AI tab.
 */
export function setupExecutorch() {
  try {
    initExecutorch({ resourceFetcher: ExpoResourceFetcher });
    console.log('[Nimo] ExecuTorch initialized with Expo resource fetcher');
  } catch (err) {
    console.warn('[Nimo] ExecuTorch initialization skipped (may not be available on this device):', err);
  }
}
