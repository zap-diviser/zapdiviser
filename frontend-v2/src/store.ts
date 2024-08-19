import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  email: string
}

interface BearState {
  user: User | null
  setUser: (user: User) => void
}

export const useStore = create(
  persist<BearState>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-storage"
    }
  )
)
