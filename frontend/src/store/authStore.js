import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: {
        id: 'user-1',
        name: 'Amarjeet Singh',
        email: 'amarjeet@example.com',
        avatar: null,
        bio: 'Productivity enthusiast & developer.',
        role: 'Pro User',
      },
      isAuthenticated: true,
      
      setUser: (userData) => set((state) => ({ 
        user: { ...state.user, ...userData } 
      })),
      
      updateProfile: (updates) => set((state) => ({
        user: { ...state.user, ...updates }
      })),
      
      setAvatar: (avatarUrl) => set((state) => ({
        user: { ...state.user, avatar: avatarUrl }
      })),
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      login: (userData) => set({ user: userData, isAuthenticated: true }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
