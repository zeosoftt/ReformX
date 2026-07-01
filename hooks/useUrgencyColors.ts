import { useMemo } from 'react';

import type { UrgencyKey } from '@/utils/appointmentUrgency';
import { useAppColors } from '@/hooks/useAppColors';

/** Kart sol şeridi + hafif arka plan tonu */
export function useUrgencyColors() {
  const c = useAppColors();

  return useMemo(
    () =>
      ({
        live: { border: c.live, bg: c.liveSubtle, badge: c.live },
        ended: { border: c.border, bg: 'rgba(142, 142, 147, 0.12)', badge: c.textMuted },
        imminent: { border: c.urgent, bg: c.urgentSubtle, badge: c.urgent },
        soon: { border: c.warning, bg: c.warningSubtle, badge: c.warning },
        today: { border: c.primary, bg: c.primarySubtle, badge: c.primary },
        later: { border: c.border, bg: c.surface, badge: c.textMuted },
      }) satisfies Record<UrgencyKey, { border: string; bg: string; badge: string }>,
    [c]
  );
}
