import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@pilatesstudio/onboarding/v1';

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const v = await AsyncStorage.getItem(KEY);
    return v === '1';
  } catch {
    return false;
  }
}

export async function setOnboardingCompleted(): Promise<void> {
  await AsyncStorage.setItem(KEY, '1');
}

export async function clearOnboardingCompleted(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
