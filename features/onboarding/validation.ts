import { z } from 'zod';

export const studioOnboardingSchema = z.object({
  name: z.string().min(1, 'Stüdyo adı gerekli').max(120),
  stationCount: z.coerce.number().int().min(0).max(500),
  trainerCount: z.coerce.number().int().min(1).max(200),
  services: z.array(z.string()).default([]),
  workingHours: z.record(z.string(), z.unknown()).default({}),
  timezone: z.string().default('Europe/Istanbul'),
});

export type StudioOnboardingForm = z.infer<typeof studioOnboardingSchema>;
