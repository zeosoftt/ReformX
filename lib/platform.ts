import { Platform } from 'react-native';

/** iOS veya Android — gerçek native runtime */
export const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

export const isIOS = Platform.OS === 'ios';

export const isAndroid = Platform.OS === 'android';

export const isWeb = Platform.OS === 'web';

/** Expo Go yerine development client / release build kullanılıyor mu (native hedef) */
export const prefersNativeShell = isNative;
