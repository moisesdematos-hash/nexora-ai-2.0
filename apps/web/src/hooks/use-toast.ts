'use client'

import { useState, useCallback } from 'react'

type ToastVariant = 'default' | 'destructive'

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  action?: React.ReactNode
}

let toastCount = 0

const listeners: Array<(toasts: Toast[]) => void> = []
let memoryToasts: Toast[] = []

function dispatch(toast: Toast) {
  memoryToasts = [...memoryToasts, toast]
  listeners.forEach((l) => l(memoryToasts))
  setTimeout(() => {
    memoryToasts = memoryToasts.filter((t) => t.id !== toast.id)
    listeners.forEach((l) => l(memoryToasts))
  }, 5000)
}

export function toast(options: Omit<Toast, 'id'>) {
  const id = String(++toastCount)
  dispatch({ id, ...options })
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(memoryToasts)

  useCallback(() => {
    listeners.push(setToasts)
    return () => {
      const index = listeners.indexOf(setToasts)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])()

  return { toasts, toast }
}
