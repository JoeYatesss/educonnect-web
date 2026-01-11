'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import MarketingNav from '@/components/marketing/MarketingNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import ModalContext from '@/contexts/ModalContext';

// Lazy load modals - only loaded when user clicks login/signup
const LoginModal = dynamic(() => import('@/components/modals/LoginModal'), {
  ssr: false,
});
const SignupModal = dynamic(() => import('@/components/modals/SignupModal'), {
  ssr: false,
});

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const modalContextValue = {
    openLogin: () => setIsLoginModalOpen(true),
    openSignup: () => setIsSignupModalOpen(true),
  };

  return (
    <ModalContext.Provider value={modalContextValue}>
      <div className="min-h-screen flex flex-col">
        <MarketingNav
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onOpenSignup={() => setIsSignupModalOpen(true)}
        />
        <main className="flex-1">
          {children}
        </main>
        <MarketingFooter />
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </ModalContext.Provider>
  );
}
