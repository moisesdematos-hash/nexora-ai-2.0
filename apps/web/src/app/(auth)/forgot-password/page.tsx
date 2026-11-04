'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase'
import { Loader2, ArrowLeft } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Email inválido'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setServerError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) {
      setServerError('Erro ao enviar email de recuperação.')
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Email enviado!</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Verifica o teu email. Enviámos um link para redefinires a tua password.
          </p>
          <Link href="/login" className="text-sm text-violet-600 font-medium hover:underline flex items-center justify-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Voltar ao login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border shadow-xl p-8">
          <div className="flex justify-center mb-8">
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              NEXORA AI
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground text-center mb-1">Recuperar password</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Introduz o teu email e enviamos um link de recuperação.
          </p>

          {serverError && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                placeholder="nome@exemplo.com"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'A enviar...' : 'Enviar link de recuperação'}
            </button>
          </form>

          <Link href="/login" className="flex items-center justify-center gap-1 mt-5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  )
}
