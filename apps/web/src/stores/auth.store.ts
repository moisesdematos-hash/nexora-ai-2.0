'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
}

interface Organization {
  id: string
  name: string
  slug: string
  credits: number
  planSlug: string
}

interface AuthState {
  user: User | null
  organization: Organization | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setOrganization: (org: Organization | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      organization: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setOrganization: (organization) => set({ organization }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, organization: null }),
    }),
    {
      name: 'nexora-auth',
      partialize: (state) => ({
        user: state.user,
        organization: state.organization,
      }),
    }
  )
)
