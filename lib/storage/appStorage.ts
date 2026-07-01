import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Büyük JSON state (danışanlar, randevular).
 * Native: AsyncStorage → platform native depolama.
 */
export const appStorage = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key),
};
