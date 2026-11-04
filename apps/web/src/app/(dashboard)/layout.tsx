import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Sidebar } from '@/components/shared/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  try {
    const supabase = await createServerSupabaseClient()
    await supabase.auth.getUser()
  } catch {
    // Allow seamless local / demo studio access when Supabase is offline
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
