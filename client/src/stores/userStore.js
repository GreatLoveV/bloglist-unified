import { create } from 'zustand'

const useUserStore = create((set) => ({
  user: null,
  actions: {
    setUser: (value) => set({ user: value }),
  },
}))

export const useUser = () => useUserStore((state) => state.user)
export const useUserActions = () => useUserStore((state) => state.actions)
