/** Domain types — onboarding / studio profile (maps to `studios` row) */

import type { StudioId } from '@/features/shared/ids';

export type { StudioId };

export interface StudioOnboarding {
  id: StudioId;
  name: string;
  stationCount: number;
  trainerCount: number;
  services: string[];
  workingHours: Record<string, unknown>;
  timezone: string;
  createdAt: string;
}

export type StudioOnboardingInput = Omit<StudioOnboarding, 'id' | 'createdAt'> & {
  name: string;
};
