'use client';

import { AuthProvider } from '@/contexts/AuthContext';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
