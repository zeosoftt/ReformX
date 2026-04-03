import { z } from 'zod';

export const clientUpsertSchema = z.object({
  name: z.string().min(1).max(200),
  phone: z.string().max(40).optional().nullable(),
  email: z.string().max(200).optional().nullable(),
  goals: z.array(z.string()).default([]),
  trainerNotes: z.string().max(5000).optional().nullable(),
});

export const clientHealthSchema = z.object({
  injuries: z.string().max(8000).optional().nullable(),
  conditions: z.string().max(8000).optional().nullable(),
  medicalNotes: z.string().max(8000).optional().nullable(),
});

export const clientMeasurementSchema = z.object({
  measuredAt: z.string().datetime({ offset: true }).optional(),
  weightKg: z.number().min(20).max(400).optional().nullable(),
  heightCm: z.number().min(50).max(260).optional().nullable(),
  waistCm: z.number().min(30).max(300).optional().nullable(),
  hipCm: z.number().min(30).max(300).optional().nullable(),
  bodyFatPercent: z.number().min(0).max(100).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export type ClientUpsertForm = z.infer<typeof clientUpsertSchema>;
