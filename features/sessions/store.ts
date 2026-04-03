import { create } from 'zustand';

import type { SessionEntity } from './types';

type SessionsState = {
  items: SessionEntity[];
  setItems: (items: SessionEntity[]) => void;
  upsertLocal: (s: SessionEntity) => void;
};

export const useSessionsStore = create<SessionsState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  upsertLocal: (sess) =>
    set((state) => {
      const i = state.items.findIndex((x) => x.id === sess.id);
      if (i === -1) return { items: [...state.items, sess].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)) };
      const next = [...state.items];
      next[i] = sess;
      return { items: next };
    }),
}));
