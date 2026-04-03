import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  defaultStudioProfile,
  type StudioOnboardingProfile,
} from '@/types/studioProfile';

const KEY = '@pilatesstudio/studio-profile/v1';

export async function loadStudioProfile(): Promise<StudioOnboardingProfile> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return defaultStudioProfile();
    const parsed = JSON.parse(raw) as Partial<StudioOnboardingProfile>;
    return { ...defaultStudioProfile(), ...parsed };
  } catch {
    return defaultStudioProfile();
  }
}

export async function saveStudioProfile(profile: StudioOnboardingProfile): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(profile));
}
