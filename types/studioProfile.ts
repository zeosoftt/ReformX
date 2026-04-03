/** Onboarding + stüdyo yapılandırması (yerel saklanır) */

export type StudioPriority =
  | 'musteri_takibi'
  | 'randevu_kaosu'
  | 'odeme_takibi'
  | 'musteri_kaybi';

export interface StudioOnboardingProfile {
  studioName: string;
  branchCount: number;
  stationCount: number;
  instructorCount: number;
  services: {
    pilates: boolean;
    physiotherapy: boolean;
    personalTraining: boolean;
    groupClasses: boolean;
    online: boolean;
  };
  /** Dersler yalnızca randevu ile mi */
  appointmentOnly: boolean;
  hasGroupClasses: boolean;
  defaultSessionMinutes: 30 | 50 | 60;
  /** Örn. 09:00–21:00 */
  workingHoursNote: string;
  hasPackageSystem: boolean;
  packageTypes: {
    sessionCount: boolean;
    monthlyUnlimited: boolean;
  };
  acceptsOnlinePayment: boolean;
  priority: StudioPriority | null;
  /** Bonus analiz (tahmini) */
  monthlyAvgClients: number | null;
  estimatedOccupancyPercent: number | null;
}

export function defaultStudioProfile(): StudioOnboardingProfile {
  return {
    studioName: '',
    branchCount: 1,
    stationCount: 1,
    instructorCount: 1,
    services: {
      pilates: true,
      physiotherapy: false,
      personalTraining: false,
      groupClasses: false,
      online: false,
    },
    appointmentOnly: true,
    hasGroupClasses: false,
    defaultSessionMinutes: 50,
    workingHoursNote: '',
    hasPackageSystem: true,
    packageTypes: { sessionCount: true, monthlyUnlimited: false },
    acceptsOnlinePayment: false,
    priority: null,
    monthlyAvgClients: null,
    estimatedOccupancyPercent: null,
  };
}

export const PRIORITY_OPTIONS: {
  id: StudioPriority;
  label: string;
  hint: string;
}[] = [
  { id: 'musteri_takibi', label: 'Müşteri takibi', hint: 'Danışanları tek yerden yönetin' },
  { id: 'randevu_kaosu', label: 'Randevu düzeni', hint: 'Takvim ve yoğunluk' },
  { id: 'odeme_takibi', label: 'Ödeme takibi', hint: 'Paket ve tahsilat' },
  { id: 'musteri_kaybi', label: 'Müşteri kaybı / geri kazanım', hint: 'Devam ve iletişim' },
];
