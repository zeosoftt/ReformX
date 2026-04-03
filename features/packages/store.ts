import { create } from 'zustand';

import type { ClientPackageEntity, PackageTemplateEntity } from './types';

type PackagesState = {
  templates: PackageTemplateEntity[];
  clientPackages: ClientPackageEntity[];
  setTemplates: (t: PackageTemplateEntity[]) => void;
  setClientPackages: (p: ClientPackageEntity[]) => void;
};

export const usePackagesStore = create<PackagesState>((set) => ({
  templates: [],
  clientPackages: [],
  setTemplates: (templates) => set({ templates }),
  setClientPackages: (clientPackages) => set({ clientPackages }),
}));
