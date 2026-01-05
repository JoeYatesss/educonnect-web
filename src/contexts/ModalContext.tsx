'use client';

import { createContext, useContext } from 'react';

interface ModalContextType {
  openLogin: () => void;
  openSignup: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export default ModalContext;
