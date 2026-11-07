import { createBrowserClient } from '@supabase/ssr'

const PLACEHOLDER_URL = 'https://demo-nexora.supabase.co'
const PLACEHOLDER_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder'

export function getSupabaseConfig() {
  if (typeof window !== 'undefined') {
    const storedUrl = window.localStorage.getItem('nexora_supabase_url')
    const storedKey = window.localStorage.getItem('nexora_supabase_anon_key')
    if (storedUrl && storedKey && !storedUrl.includes('demo-nexora.supabase.co')) {
      return { url: storedUrl, anonKey: storedKey, isCustom: true }
    }
  }
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_KEY
  return {
    url: envUrl,
    anonKey: envKey,
    isCustom:
      Boolean(envUrl) &&
      envUrl !== PLACEHOLDER_URL &&
      !envUrl.includes('your-project.supabase.co') &&
      envKey !== PLACEHOLDER_KEY,
  }
}

export function isRealSupabaseConfigured(): boolean {
  const cfg = getSupabaseConfig()
  return cfg.isCustom
}

export function createClient() {
  const cfg = getSupabaseConfig()
  return createBrowserClient(cfg.url, cfg.anonKey)
}
