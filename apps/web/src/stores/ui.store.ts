'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarCollapsed: boolean
  sidebarMobileOpen: boolean
  setSidebarCollapsed: (v: boolean) => void
  setSidebarMobileOpen: (v: boolean) => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setSidebarMobileOpen: (sidebarMobileOpen) => set({ sidebarMobileOpen }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    { name: 'nexora-ui' }
  )
)
