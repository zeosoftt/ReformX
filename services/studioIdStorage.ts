import type { StudioId } from '@/features/shared/ids';
import { useOnboardingStore } from '@/features/onboarding/store';
import { env } from '@/lib/env';
import { storageKeys } from '@/lib/storage/keys';
import { secureStorage } from '@/lib/storage/secureStorage';

export async function loadPersistedStudioId(): Promise<StudioId | null> {
  const stored = await secureStorage.getItem(storageKeys.studioId);
  if (stored?.trim()) return stored.trim() as StudioId;
  const fromEnv = env.defaultStudioId.trim();
  return fromEnv ? (fromEnv as StudioId) : null;
}

export async function persistStudioId(id: StudioId): Promise<void> {
  await secureStorage.setItem(storageKeys.studioId, id);
  useOnboardingStore.getState().setCurrentStudioId(id);
}

export async function clearPersistedStudioId(): Promise<void> {
  await secureStorage.removeItem(storageKeys.studioId);
  useOnboardingStore.getState().setCurrentStudioId(null);
}

/** Uygulama açılışında Zustand’ı doldur */
export async function hydrateStudioIdFromDevice(): Promise<StudioId | null> {
  const id = await loadPersistedStudioId();
  useOnboardingStore.getState().setCurrentStudioId(id);
  return id;
}
