'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Search, Heart, Settings, Building2, Menu, X, Lock, Briefcase, UserCheck } from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresPayment?: boolean;
}

const navItems: NavItem[] = [
  { href: '/school-dashboard', label: 'Dashboard', icon: BookOpen },
  { href: '/find-talent', label: 'Find Talent', icon: Search, requiresPayment: true },
  { href: '/saved-teachers', label: 'Saved', icon: Heart, requiresPayment: true },
  { href: '/my-jobs', label: 'My Jobs', icon: Briefcase, requiresPayment: true },
  { href: '/interview-selections', label: 'Interviews', icon: UserCheck, requiresPayment: true },
  { href: '/school-account', label: 'Account', icon: Settings },
];

export default function SchoolNavHeader() {
  const { schoolAccount, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto px-6 h-20 max-w-7xl">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/school-dashboard" className="flex items-center gap-2 group">
            <span className="text-gray-900 font-montserrat text-2xl font-bold tracking-tight group-hover:text-gray-700 transition-colors">
              EduConnect
            </span>
            <span
              className="text-brand-red font-chinese text-[1.75rem] font-bold group-hover:scale-105 transition-transform duration-200 italic"
              style={{ textShadow: '1px 1px 3px rgba(230, 74, 74, 0.3)' }}
            >
              中国
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isLocked = item.requiresPayment && !schoolAccount?.has_paid;

              if (isLocked) {
                return (
                  <span
                    key={item.href}
                    className="font-medium text-[15px] tracking-tight flex items-center gap-2 text-gray-400 cursor-not-allowed"
                    title="Unlock with payment"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    <Lock className="w-3 h-3" />
                  </span>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium text-[15px] tracking-tight transition-all duration-200 flex items-center gap-2 ${
                    isActive(item.href)
                      ? 'text-brand-red font-semibold'
                      : 'text-gray-700 hover:text-brand-red'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-3 ml-4 border-l border-gray-200 pl-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span className="max-w-[150px] truncate">
                  {schoolAccount?.school_name || 'School'}
                </span>
              </div>
              <button
                onClick={async () => {
                  try {
                    await signOut();
                  } catch (error) {
                    console.error('Sign out error:', error);
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isLocked = item.requiresPayment && !schoolAccount?.has_paid;

                if (isLocked) {
                  return (
                    <span
                      key={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                      <Lock className="w-4 h-4 ml-auto" />
                    </span>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-brand-red bg-red-50 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-gray-200 mt-2">
                <button
                  onClick={async () => {
                    try {
                      await signOut();
                    } catch (error) {
                      console.error('Sign out error:', error);
                    }
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
