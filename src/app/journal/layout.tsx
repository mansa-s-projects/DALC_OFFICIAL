import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { template: '%s | Dubai À La Carte Journal', default: 'Dubai À La Carte Journal' },
  description: 'Expert guides, area insights, and insider knowledge for the ultimate Dubai lifestyle.',
}

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-cipher-void">{children}</div>
}
