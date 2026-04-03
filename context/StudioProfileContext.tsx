import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { loadStudioProfile } from '@/services/studioProfileStorage';
import { defaultStudioProfile, type StudioOnboardingProfile } from '@/types/studioProfile';

type Value = {
  ready: boolean;
  profile: StudioOnboardingProfile;
  refreshProfile: () => Promise<void>;
};

const Ctx = createContext<Value | null>(null);

export function StudioProfileProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<StudioOnboardingProfile>(defaultStudioProfile());

  const refreshProfile = useCallback(async () => {
    const p = await loadStudioProfile();
    setProfile(p);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      const p = await loadStudioProfile();
      if (alive) {
        setProfile(p);
        setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo<Value>(
    () => ({ ready, profile, refreshProfile }),
    [ready, profile, refreshProfile]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStudioProfile(): Value {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStudioProfile requires StudioProfileProvider');
  return v;
}
