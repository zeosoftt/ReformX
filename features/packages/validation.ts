import { z } from 'zod';

export const packageTemplateSchema = z.object({
  name: z.string().min(1).max(120),
  sessionCount: z.number().int().min(1).max(1000),
  validityDays: z.number().int().min(1).max(3650).optional().nullable(),
  priceCents: z.number().int().min(0).optional().nullable(),
  currency: z.string().length(3).default('TRY'),
});

export type PackageTemplateForm = z.infer<typeof packageTemplateSchema>;
