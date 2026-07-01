import * as SecureStore from 'expo-secure-store';

import { isWeb } from '@/lib/platform';

/**
 * Küçük hassas değerler (stüdyo id, ileride auth token).
 * iOS: Keychain · Android: EncryptedSharedPreferences · Web: localStorage fallback.
 */
export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    if (isWeb) {
      if (typeof localStorage === 'undefined') return null;
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async removeItem(key: string): Promise<void> {
    if (isWeb) {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
