import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { loadStudioState, saveStudioState } from '@/services/studioStorage';
import { defaultClientBaseline, type Appointment, type Client, type StudioState } from '@/types/studio';
import { createId } from '@/utils/id';
import { getPackageRemaining, rolloverClientPackage } from '@/utils/packagePeriod';

type StudioContextValue = {
  ready: boolean;
  state: StudioState;
  clientsById: Map<string, Client>;
  addClient: (input: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (id: string, patch: Partial<Omit<Client, 'id' | 'createdAt'>>) => void;
  removeClient: (id: string) => void;
  addAppointment: (input: Omit<Appointment, 'id'>) => Appointment;
  updateAppointment: (id: string, patch: Partial<Omit<Appointment, 'id'>>) => void;
  removeAppointment: (id: string) => void;
};

const StudioContext = createContext<StudioContextValue | null>(null);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<StudioState>({ clients: [], appointments: [] });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = await loadStudioState();
      if (!cancelled) {
        setState(loaded);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveStudioState(state).catch(() => {});
  }, [state, ready]);

  const clientsById = useMemo(() => {
    const m = new Map<string, Client>();
    for (const c of state.clients) m.set(c.id, c);
    return m;
  }, [state.clients]);

  const addClient = useCallback((input: Omit<Client, 'id' | 'createdAt'>) => {
    const base: Client = {
      ...input,
      id: createId(),
      createdAt: new Date().toISOString(),
      packageKind: input.packageKind ?? null,
      packagePeriodKey: input.packagePeriodKey ?? null,
      packageSessionsUsed: input.packageSessionsUsed ?? 0,
      goals: input.goals ?? [],
      baseline: input.baseline ?? defaultClientBaseline(),
    };
    const client = rolloverClientPackage(base);
    setState((s) => ({ ...s, clients: [client, ...s.clients] }));
    return client;
  }, []);

  const updateClient = useCallback(
    (id: string, patch: Partial<Omit<Client, 'id' | 'createdAt'>>) => {
      setState((s) => ({
        ...s,
        clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      }));
    },
    []
  );

  const removeClient = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      clients: s.clients.filter((c) => c.id !== id),
      appointments: s.appointments.filter((a) => a.clientId !== id),
    }));
  }, []);

  const addAppointment = useCallback((input: Omit<Appointment, 'id'>) => {
    const ap: Appointment = {
      ...input,
      id: createId(),
      attendance: input.attendance ?? 'unset',
      packageCreditApplied: input.packageCreditApplied ?? false,
    };
    setState((s) => ({ ...s, appointments: [ap, ...s.appointments] }));
    return ap;
  }, []);

  const updateAppointment = useCallback(
    (id: string, patch: Partial<Omit<Appointment, 'id'>>) => {
      setState((s) => {
        const prev = s.appointments.find((a) => a.id === id);
        if (!prev) return s;

        let next: Appointment = { ...prev, ...patch };
        let clients = s.clients.map((c) => (c.id === prev.clientId ? rolloverClientPackage(c) : c));

        const attChanged =
          patch.attendance !== undefined && patch.attendance !== prev.attendance;

        if (attChanged && patch.attendance !== undefined) {
          const client = clients.find((c) => c.id === prev.clientId);
          if (client) {
            if (patch.attendance === 'present' && prev.attendance !== 'present') {
              const remaining = getPackageRemaining(client);
              if (
                remaining !== null &&
                remaining > 0 &&
                !prev.packageCreditApplied
              ) {
                next = { ...next, packageCreditApplied: true };
                clients = clients.map((c) =>
                  c.id === client.id
                    ? { ...c, packageSessionsUsed: c.packageSessionsUsed + 1 }
                    : c
                );
              }
            } else if (prev.attendance === 'present' && patch.attendance !== 'present') {
              if (prev.packageCreditApplied) {
                next = { ...next, packageCreditApplied: false };
                clients = clients.map((c) =>
                  c.id === prev.clientId && c.packageKind
                    ? { ...c, packageSessionsUsed: Math.max(0, c.packageSessionsUsed - 1) }
                    : c
                );
              }
            }
          }
        }

        return {
          ...s,
          clients,
          appointments: s.appointments.map((a) => (a.id === id ? next : a)),
        };
      });
    },
    []
  );

  const removeAppointment = useCallback((id: string) => {
    setState((s) => ({ ...s, appointments: s.appointments.filter((a) => a.id !== id) }));
  }, []);

  const value = useMemo<StudioContextValue>(
    () => ({
      ready,
      state,
      clientsById,
      addClient,
      updateClient,
      removeClient,
      addAppointment,
      updateAppointment,
      removeAppointment,
    }),
    [
      ready,
      state,
      clientsById,
      addClient,
      updateClient,
      removeClient,
      addAppointment,
      updateAppointment,
      removeAppointment,
    ]
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used within StudioProvider');
  return ctx;
}
