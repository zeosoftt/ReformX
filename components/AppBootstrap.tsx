import { useEffect } from 'react';

import { hydrateStudioIdFromDevice } from '@/services/studioIdStorage';

/**
 * Native bootstrap — SecureStore’dan stüdyo kimliği, root layout’ta bir kez çalışır.
 */
export function AppBootstrap() {
  useEffect(() => {
    void hydrateStudioIdFromDevice();
  }, []);

  return null;
}
