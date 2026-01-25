'use client';

import { useState, useEffect } from 'react';
import { Languages } from 'lucide-react';

interface LanguageToggleProps {
  onLanguageChange?: (lang: 'en' | 'zh') => void;
}

export default function LanguageToggle({ onLanguageChange }: LanguageToggleProps) {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLang = localStorage.getItem('schools-page-language') as 'en' | 'zh' | null;
    if (savedLang) {
      setLanguage(savedLang);
      onLanguageChange?.(savedLang);
    }
  }, [onLanguageChange]);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'zh' : 'en';
    setLanguage(newLang);
    localStorage.setItem('schools-page-language', newLang);
    onLanguageChange?.(newLang);
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('languageChange', { detail: newLang }));
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-brand-red hover:text-brand-red transition-all duration-200 text-sm font-medium"
      aria-label="Toggle language"
    >
      <Languages className="w-4 h-4" />
      <span>{language === 'en' ? '中文' : 'English'}</span>
    </button>
  );
}
