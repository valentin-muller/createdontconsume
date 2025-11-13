'use client'

import { ToastProvider } from '@/contexts/ToastContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Toast from '@/components/Toast'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
        <Toast />
      </ToastProvider>
    </ThemeProvider>
  )
}
