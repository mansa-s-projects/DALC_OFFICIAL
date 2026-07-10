import type { ReactNode } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notifications',
  robots: { index: false, follow: false },
}

export default function NotificationsLayout({ children }: { children: ReactNode }) {
  return children
}
