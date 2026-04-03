import { useMemo } from 'react';

import type { UrgencyKey } from '@/utils/appointmentUrgency';
import { useAppColors } from '@/hooks/useAppColors';

/** Kart sol şeridi + hafif arka plan tonu */
export function useUrgencyColors() {
  const c = useAppColors();

  return useMemo(
    () =>
      ({
        live: {
          border: '#7C3AED',
          bg: 'rgba(124, 58, 237, 0.12)',
          badge: '#7C3AED',
        },
        ended: {
          border: c.border,
          bg: 'rgba(142, 142, 147, 0.12)',
          badge: c.textMuted,
        },
        imminent: {
          border: '#EA580C',
          bg: 'rgba(234, 88, 12, 0.12)',
          badge: '#EA580C',
        },
        soon: {
          border: '#CA8A04',
          bg: 'rgba(202, 138, 4, 0.12)',
          badge: '#CA8A04',
        },
        today: {
          border: c.primary,
          bg: 'rgba(61, 90, 79, 0.1)',
          badge: c.primary,
        },
        later: {
          border: c.border,
          bg: c.surface,
          badge: c.textMuted,
        },
      }) satisfies Record<
        UrgencyKey,
        { border: string; bg: string; badge: string }
      >,
    [c.border, c.primary, c.surface, c.textMuted]
  );
}
