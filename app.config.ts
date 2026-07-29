import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const IS_DEV = process.env.APP_VARIANT === 'development';
  const basePackage = config.android?.package || 'com.cornerstonestudio.nimoai';
  const baseBundleId = config.ios?.bundleIdentifier || 'com.cornerstonestudio.nimoai';

  return {
    ...config,
    name: IS_DEV ? `${config.name} (Dev)` : config.name,
    android: {
      ...config.android,
      package: IS_DEV ? `${basePackage}.dev` : basePackage,
    },
    ios: {
      ...config.ios,
      bundleIdentifier: IS_DEV ? `${baseBundleId}.dev` : baseBundleId,
    },
  } as ExpoConfig;
};
