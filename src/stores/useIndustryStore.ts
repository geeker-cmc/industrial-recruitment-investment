import { create } from 'zustand';

type IndustryState = {
  currentIndustryChainId?: string;
  setCurrentIndustryChainId: (id: string) => void;
};

export const useIndustryStore = create<IndustryState>((set) => ({
  currentIndustryChainId: undefined,
  setCurrentIndustryChainId: (id) => set({ currentIndustryChainId: id }),
}));
