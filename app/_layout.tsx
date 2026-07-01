import 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import { AppBootstrap } from '@/components/AppBootstrap';
import Colors from '@/constants/Colors';
import { StudioProfileProvider } from '@/context/StudioProfileContext';
import { StudioProvider } from '@/context/StudioContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  /** Önce `app/index.tsx` (onboarding kontrolü) çalışsın */
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  const navTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const merged = {
    ...navTheme,
    colors: {
      ...navTheme.colors,
      background: palette.background,
      card: palette.surface,
      border: palette.border,
      primary: palette.primary,
      text: palette.text,
    },
  };

  return (
    <SafeAreaProvider>
      <AppBootstrap />
      <StudioProfileProvider>
        <StudioProvider>
          <ThemeProvider value={merged}>
            <Stack screenOptions={{ headerShown: false }} />
          </ThemeProvider>
        </StudioProvider>
      </StudioProfileProvider>
    </SafeAreaProvider>
  );
}
