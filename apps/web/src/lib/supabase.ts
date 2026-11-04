import { createBrowserClient } from '@supabase/ssr'

export function getSupabaseConfig() {
  if (typeof window !== 'undefined') {
    const storedUrl = localStorage.getItem('nexora_supabase_url')
    const storedKey = localStorage.getItem('nexora_supabase_anon_key')
    if (storedUrl && storedKey) {
      return { url: storedUrl, anonKey: storedKey, isCustom: true }
    }
  }
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-nexora.supabase.co'
  const envKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder'
  return {
    url: envUrl,
    anonKey: envKey,
    isCustom:
      envUrl !== 'https://demo-nexora.supabase.co' &&
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
