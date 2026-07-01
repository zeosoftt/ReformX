/**
 * OnBoard Health — pilates stüdyoları & fizyoterapi merkezlerine satılan B2B yazılım.
 * Stüdyo adı onboarding’den gelir; bu sabitler ürün kimliğidir.
 */
export const brand = {
  productName: 'OnBoard Health',
  productFullName: 'OnBoard Health',
  tagline: 'Pilates & fizyoterapi merkezleri için',
  sectors: {
    pilates: 'Pilates',
    physiotherapy: 'Fizyoterapi',
    personalTraining: 'Personal',
    groupClasses: 'Grup dersi',
    online: 'Online seans',
  },
} as const;

export type BrandSectorKey = keyof typeof brand.sectors;
