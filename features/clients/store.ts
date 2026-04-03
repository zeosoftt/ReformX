import { create } from 'zustand';

import type { ClientEntity, ClientId } from './types';

type ClientsState = {
  items: ClientEntity[];
  selectedId: ClientId | null;
  setItems: (items: ClientEntity[]) => void;
  upsertLocal: (c: ClientEntity) => void;
  removeLocal: (id: ClientId) => void;
  select: (id: ClientId | null) => void;
};

export const useClientsStore = create<ClientsState>((set) => ({
  items: [],
  selectedId: null,
  setItems: (items) => set({ items }),
  upsertLocal: (c) =>
    set((s) => {
      const i = s.items.findIndex((x) => x.id === c.id);
      if (i === -1) return { items: [c, ...s.items] };
      const next = [...s.items];
      next[i] = c;
      return { items: next };
    }),
  removeLocal: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
  select: (id) => set({ selectedId: id }),
}));
