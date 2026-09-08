/**
 * Central image asset registry.
 * Provides typed, centralized imports for all static image assets in the app.
 *
 * Usage:
 *   import { IMAGES } from '@/assets/images';
 *   // or
 *   import { IMAGES } from '@/assets';
 *
 *   <Image source={IMAGES.nimo.brandName} />
 */

export const IMAGES = {
  nimo: {
    authBackground: require('./images/nimo/auth_screen_background.png'),
    brandFootnote: require('./images/nimo/brand_footnote.png'),
    brandLogo: require('./images/nimo/brand_logo.png'),
    brandName: require('./images/nimo/brand_name.png'),
    iphoneMockup: require('./images/nimo/iphone_mockup.png'),
    nimoAI: require('./images/nimo/nimoAI.png'),
    nimoCapture: require('./images/nimo/nimo_capture.jpg'),
    nimoGetStarted: require('./images/nimo/nimo_getstarted.jpg'),
    nimoLogo: require('./images/nimo/nimo_logo.png'),
    nimoProtect: require('./images/nimo/nimo_protect.jpg'),
    nimoRelive: require('./images/nimo/nimo_relive.jpg'),
    nimoWelcome: require('./images/nimo/nimo_welcome.jpg'),
    sprout: require('./images/nimo/sprout.png'),
    sproutLevel2: require('./images/nimo/sprout_level2_growth.png'),
    sproutLevel3: require('./images/nimo/sprout_level3_growth.png'),
    sproutLevel4: require('./images/nimo/sprout_level4_growth.png'),
    treeMemoryOfTheMonth: require('./images/nimo/tree_memoryofthemonth.png'),
  },
  general: {
    appIcon: require('./images/icon.png'),
    splashIcon: require('./images/splash-icon.png'),
    favicon: require('./images/favicon.png'),
    logoGlow: require('./images/logo-glow.png'),
    expoLogo: require('./images/expo-logo.png'),
    expoBadge: require('./images/expo-badge.png'),
    expoBadgeWhite: require('./images/expo-badge-white.png'),
    tutorialWeb: require('./images/tutorial-web.png'),
    reactLogo: require('./images/react-logo.png'),
    androidIconBg: require('./images/android-icon-background.png'),
    androidIconFg: require('./images/android-icon-foreground.png'),
    androidIconMonochrome: require('./images/android-icon-monochrome.png'),
  },
  tabIcons: {
    home: require('./images/tabIcons/home.png'),
    explore: require('./images/tabIcons/explore.png'),
  },
} as const;

export type AppImages = typeof IMAGES;
