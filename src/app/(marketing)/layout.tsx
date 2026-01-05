'use client';

import { useState } from 'react';
import MarketingNav from '@/components/marketing/MarketingNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import LoginModal from '@/components/modals/LoginModal';
import SignupModal from '@/components/modals/SignupModal';
import ModalContext from '@/contexts/ModalContext';

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
