export interface PackageTemplateEntity {
  id: string;
  studioId: string;
  name: string;
  sessionCount: number;
  validityDays: number | null;
  priceCents: number | null;
  currency: string;
  active: boolean;
}

export interface ClientPackageEntity {
  id: string;
  clientId: string;
  templateId: string | null;
  sessionsTotal: number;
  sessionsRemaining: number;
  startsAt: string;
  expiresAt: string | null;
}
