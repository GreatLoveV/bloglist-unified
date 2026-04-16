import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  notification: { message: null, type: null },
  actions: {
    setNotification: (notification) => set(() => ({ notification })),
    clearNotification: () =>
      set(() => ({ notification: { message: null, type: null } })),
  },
}))

export const useNotification = () =>
  useNotificationStore((state) => state.notification)

export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions)

export default useNotificationStore
