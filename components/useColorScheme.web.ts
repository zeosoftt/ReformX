import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Web: SSR ile uyumlu — ilk render light, hydrate sonrası sistem teması.
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const scheme = useRNColorScheme();

  if (hasHydrated) {
    return scheme;
  }

  return 'light';
}
