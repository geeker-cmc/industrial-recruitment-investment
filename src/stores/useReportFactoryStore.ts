import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  reportFactoryInitialConversations,
  reportFactorySkills,
  type ReportFactoryConversation,
  type ReportFactoryMessage,
  type ReportFactorySkill,
  type ReportFactoryView,
} from '../mock/reportFactory';

type NewConversationOptions = {
  skillId?: string;
  title?: string;
};

type ReportFactoryState = {
  view: ReportFactoryView;
  currentConversationId: string;
  conversations: ReportFactoryConversation[];
  skills: ReportFactorySkill[];
  setView: (view: ReportFactoryView) => void;
  createConversation: (options?: NewConversationOptions) => string;
  selectConversation: (conversationId: string) => void;
  renameConversation: (conversationId: string, title: string) => void;
  archiveConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  appendMessage: (conversationId: string, message: ReportFactoryMessage) => void;
  updateConversation: (conversationId: string, patch: Partial<ReportFactoryConversation>) => void;
  toggleSkill: (skillId: string) => void;
  addSkill: (skill: ReportFactorySkill) => void;
  updateSkill: (skillId: string, patch: Partial<ReportFactorySkill>) => void;
  deleteSkill: (skillId: string) => void;
};

const defaultSkillId = reportFactorySkills[0]?.id ?? 'due-diligence';
const initialConversationId = reportFactoryInitialConversations[0]?.id ?? 'conversation-new';

export const useReportFactoryStore = create<ReportFactoryState>()(
  persist(
    (set) => ({
      view: 'conversation',
      currentConversationId: initialConversationId,
      conversations: reportFactoryInitialConversations,
      skills: reportFactorySkills,
      setView: (view) => set({ view }),
      createConversation: (options = {}) => {
        const id = `conversation-${Date.now()}`;
        const now = new Date().toISOString();
        const conversation: ReportFactoryConversation = {
          id,
          title: options.title ?? '新建对话',
          summary: '尚未开始对话',
          skillId: options.skillId ?? defaultSkillId,
          messages: [],
          status: 'active',
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          currentConversationId: id,
          view: 'conversation',
          conversations: [conversation, ...state.conversations],
        }));
        return id;
      },
      selectConversation: (conversationId) =>
        set({ currentConversationId: conversationId, view: 'conversation' }),
      renameConversation: (conversationId, title) =>
        set((state) => ({
          conversations: state.conversations.map((conversation) =>
            conversation.id === conversationId ? { ...conversation, title: title.trim() } : conversation,
          ),
        })),
      archiveConversation: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((conversation) =>
            conversation.id === conversationId ? { ...conversation, status: 'archived' } : conversation,
          ),
        })),
      deleteConversation: (conversationId) =>
        set((state) => {
          const conversations = state.conversations.filter((conversation) => conversation.id !== conversationId);
          const nextConversation = conversations.find((conversation) => conversation.status === 'active');
          return {
            conversations,
            currentConversationId:
              state.currentConversationId === conversationId ? nextConversation?.id ?? '' : state.currentConversationId,
            view: 'conversation',
          };
        }),
      appendMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations
            .map((conversation) =>
              conversation.id === conversationId
                ? {
                    ...conversation,
                    messages: [...conversation.messages, message],
                    summary: message.content,
                    updatedAt: message.createdAt,
                  }
                : conversation,
            )
            .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)),
        })),
      updateConversation: (conversationId, patch) =>
        set((state) => ({
          conversations: state.conversations.map((conversation) =>
            conversation.id === conversationId ? { ...conversation, ...patch } : conversation,
          ),
        })),
      toggleSkill: (skillId) =>
        set((state) => ({
          skills: state.skills.map((skill) => (skill.id === skillId ? { ...skill, enabled: !skill.enabled } : skill)),
        })),
      addSkill: (skill) => set((state) => ({ skills: [...state.skills, skill] })),
      updateSkill: (skillId, patch) =>
        set((state) => ({
          skills: state.skills.map((skill) => (skill.id === skillId ? { ...skill, ...patch } : skill)),
        })),
      deleteSkill: (skillId) => set((state) => ({ skills: state.skills.filter((skill) => skill.id !== skillId) })),
    }),
    {
      name: 'industrial-platform-report-factory',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
