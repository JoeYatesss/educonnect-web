'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SchoolsNav from '@/components/marketing/SchoolsNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';

const LoginModal = dynamic(() => import('@/components/modals/LoginModal'), {
  ssr: false,
});

export default function SchoolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <SchoolsNav onOpenLogin={() => setIsLoginModalOpen(true)} />
      <main className="flex-1">
        {children}
      </main>
      <MarketingFooter />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
