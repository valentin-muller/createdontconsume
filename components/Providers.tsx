'use client'

import { ToastProvider } from '@/contexts/ToastContext'
import Toast from '@/components/Toast'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <Toast />
    </ToastProvider>
  )
}
