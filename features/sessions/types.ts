import type { SessionId } from '@/features/shared/ids';

export type { SessionId };

export type SessionStatus = 'scheduled' | 'completed' | 'no_show' | 'cancelled';

export interface SessionEntity {
  id: SessionId;
  studioId: string;
  clientId: string;
  trainerId: string | null;
  scheduledAt: string;
  durationMin: number;
  sessionType: string | null;
  status: SessionStatus;
  attendanceNotes: string | null;
  createdAt: string;
  updatedAt: string;
}
