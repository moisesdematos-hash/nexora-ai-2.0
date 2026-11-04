import { createBrowserClient } from '@supabase/ssr'

export const DEFAULT_SUPABASE_URL = 'https://qtngmvqehbzylvsgwive.supabase.co'
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_AGqaN8NHejJ-_1MqSFN1qQ_UbcIOfU9'

export function getSupabaseConfig() {
  if (typeof window !== 'undefined') {
    const storedUrl = localStorage.getItem('nexora_supabase_url')
    const storedKey = localStorage.getItem('nexora_supabase_anon_key')
    if (
      storedUrl &&
      storedKey &&
      !storedUrl.includes('demo-nexora.supabase.co')
    ) {
      return { url: storedUrl, anonKey: storedKey, isCustom: true }
    }
  }
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY
  return {
    url: envUrl,
    anonKey: envKey,
    isCustom:
      Boolean(envUrl) &&
      !envUrl.includes('demo-nexora.supabase.co') &&
      !envUrl.includes('your-project.supabase.co'),
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
