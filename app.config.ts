import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const variant = process.env.APP_VARIANT;
  const isDev = variant === 'development';
  const isPreview = variant === 'preview';

  const getAppName = () => {
    if (isDev) return 'Nimo - Life Journal (Dev)';
    if (isPreview) return 'Nimo - Life Journal (Preview)';
    return 'Nimo - Life Journal';
  };

  const getIdentifier = () => {
    if (isDev) return 'com.cornerstonestudio.nimoai.dev';
    if (isPreview) return 'com.cornerstonestudio.nimoai.preview';
    return 'com.cornerstonestudio.nimoai';
  };

  return {
    ...config,
    name: getAppName(),
    slug: 'Nimo',
    version: '1.0.0',
    orientation: 'portrait',
    updates: {
      url: 'https://u.expo.dev/e963b477-ea1d-47a4-88ff-03bc1b408911',
      checkAutomatically: 'ON_LOAD',
      fallbackToCacheTimeout: 0,
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    icon: './assets/images/nimo/nimo_logo.png',
    scheme: 'nimo',
    userInterfaceStyle: 'light',
    ios: {
      icon: './assets/images/nimo/nimo_logo.png',
      bundleIdentifier: getIdentifier(),
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#fbf9f4',
        foregroundImage: './assets/images/nimo/nimo_logo.png',
      },
      predictiveBackGestureEnabled: false,
      package: getIdentifier(),
      googleServicesFile: './google-services.json',
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#fbf9f4',
          android: {
            image: './assets/images/nimo/nimo_logo.png',
            imageWidth: 120,
          },
        },
      ],
      'expo-sqlite',
      'expo-video',
      'expo-notifications',
      'expo-updates',
      'react-native-nitro-google-signin',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: 'e963b477-ea1d-47a4-88ff-03bc1b408911',
      },
    },
    owner: 'dakstar-org',
  };
};
