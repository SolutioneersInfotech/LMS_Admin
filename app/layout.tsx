// app/layout.tsx (Server Component - no 'use client')
import type { Metadata } from 'next'
import './globals.css'
import ReactQueryProvider from './ReactQueryProvider'  // client wrapper

export const metadata: Metadata = {
  title: 'Admin Solvarsity',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  )
}
