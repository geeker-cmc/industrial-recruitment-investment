import { create } from 'zustand';
import type {
  OpportunityFilters,
  OpportunityRecommendation,
  OpportunityStrategy,
} from '../mock/opportunity';

type OpportunityState = {
  strategy: OpportunityStrategy;
  keyword: string;
  draftFilters: OpportunityFilters;
  appliedFilters: OpportunityFilters;
  recommendations: OpportunityRecommendation[];
  setStrategy: (strategy: OpportunityStrategy) => void;
  setKeyword: (keyword: string) => void;
  setDraftFilters: (filters: OpportunityFilters) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  setRecommendations: (recommendations: OpportunityRecommendation[]) => void;
};

export const useOpportunityStore = create<OpportunityState>((set) => ({
  strategy: 'investment-style',
  keyword: '',
  draftFilters: {},
  appliedFilters: {},
  recommendations: [],
  setStrategy: (strategy) => set({ strategy }),
  setKeyword: (keyword) => set({ keyword }),
  setDraftFilters: (draftFilters) => set({ draftFilters }),
  applyFilters: () => set((state) => ({ appliedFilters: state.draftFilters })),
  resetFilters: () => set({ draftFilters: {}, appliedFilters: {} }),
  setRecommendations: (recommendations) => set({ recommendations }),
}));
