import { create } from 'zustand';

import type { StudioId } from '@/features/shared/ids';
import type { StudioOnboardingForm } from './validation';

type OnboardingState = {
  /** Active studio after login / bootstrap */
  currentStudioId: StudioId | null;
  /** Wizard draft (not yet persisted) */
  draft: Partial<StudioOnboardingForm>;
  setDraft: (patch: Partial<StudioOnboardingForm>) => void;
  resetDraft: () => void;
  setCurrentStudioId: (id: StudioId | null) => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStudioId: null,
  draft: {},
  setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
  resetDraft: () => set({ draft: {} }),
  setCurrentStudioId: (id) => set({ currentStudioId: id }),
}));
