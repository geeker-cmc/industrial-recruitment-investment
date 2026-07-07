import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type UserInfo = {
  name: string;
  role: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: (account: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (account) =>
        set({
          isAuthenticated: true,
          user: {
            name: account || '演示用户',
            role: '招商投资经理',
          },
        }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'industrial-platform-auth',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
