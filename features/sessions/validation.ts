import { z } from 'zod';

export const sessionCreateSchema = z.object({
  clientId: z.string().min(1),
  trainerId: z.string().min(1).optional().nullable(),
  scheduledAt: z.string().datetime({ offset: true }),
  durationMin: z.number().int().min(15).max(240).default(50),
  sessionType: z.string().max(80).optional().nullable(),
  status: z.enum(['scheduled', 'completed', 'no_show', 'cancelled']).default('scheduled'),
});

export type SessionCreateForm = z.infer<typeof sessionCreateSchema>;
