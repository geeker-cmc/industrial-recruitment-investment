import { create } from 'zustand';

type CompanyState = {
  currentCompanyId?: string;
  setCurrentCompanyId: (id: string) => void;
};

export const useCompanyStore = create<CompanyState>((set) => ({
  currentCompanyId: undefined,
  setCurrentCompanyId: (id) => set({ currentCompanyId: id }),
}));
