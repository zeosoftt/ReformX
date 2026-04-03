import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
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
  const colorScheme = useColorScheme();

  const navTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const merged = {
    ...navTheme,
    colors: {
      ...navTheme.colors,
      background: colorScheme === 'dark' ? '#0D0F0E' : '#F5F2ED',
    },
  };

  return (
    <SafeAreaProvider>
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
