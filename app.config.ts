import type { ExpoConfig } from 'expo/config';

/**
 * Production (EAS_BUILD_PROFILE=production): Play Store AAB — dev client YOK.
 * Development: expo-dev-client ile native geliştirme.
 */
const isProduction = process.env.EAS_BUILD_PROFILE === 'production';

const config: ExpoConfig = {
  name: 'OnBoard Health',
  slug: 'onboardhealth',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'onboardhealth',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#F8F5F0',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.onboardhealth.app',
    buildNumber: '1',
    infoPlist: {
      UIBackgroundModes: [],
    },
  },
  android: {
    package: 'com.onboardhealth.app',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#F8F5F0',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: true,
    permissions: ['INTERNET'],
    blockedPermissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.CAMERA',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.READ_CONTACTS',
      'android.permission.WRITE_CONTACTS',
      'android.permission.READ_SMS',
      'android.permission.SYSTEM_ALERT_WINDOW',
    ],
    allowBackup: false,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    ...(isProduction ? [] : ['expo-dev-client']),
    '@react-native-community/datetimepicker',
    'expo-secure-store',
    [
      'expo-build-properties',
      {
        android: {
          newArchEnabled: true,
          minSdkVersion: 24,
          targetSdkVersion: 35,
          compileSdkVersion: 35,
        },
        ios: {
          newArchEnabled: true,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    supportEmail: process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? 'destek@onboardhealth.app',
    privacyPolicyUrl: process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ?? '',
  },
};

export default config;
