import { create } from 'zustand';
import { investmentProjects, type InvestmentProject } from '../mock/investment';

type InvestmentState = {
  projects: InvestmentProject[];
  addProject: (project: InvestmentProject) => void;
  updateProject: (projectId: string, updater: (project: InvestmentProject) => InvestmentProject) => void;
};

export const useInvestmentStore = create<InvestmentState>((set) => ({
  projects: investmentProjects,
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
  updateProject: (projectId, updater) =>
    set((state) => ({
      projects: state.projects.map((project) => (project.id === projectId ? updater(project) : project)),
    })),
}));
