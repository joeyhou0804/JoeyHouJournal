import type { Metadata } from 'next'
import AdminShell from './_shell'

export const metadata: Metadata = {
  title: "Admin - Joey Hou's Journal",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
